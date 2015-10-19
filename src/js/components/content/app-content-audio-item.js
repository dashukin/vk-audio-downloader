/**
 * @namespace audioData.artist
 */
'use strict';

import React from 'react';
import Component from '../component.js';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import AudioPlayer from '../../player/audio-player.js';

class AudioItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isPlaying: false,
			decreaseTime: true,
			timeProgress: 0,
			timelineProgress: 0,
			bufferedPercents: 0
		};
	}

	componentWillMount () {

	}

	componentDidMount () {

		var self = this,
			props = self.props,
			audioId = self.props.data.aid,
			playbackInfo,
			isActiveAudio;

		playbackInfo = props.playbackInfo && props.playbackInfo.toObject() || null;;

		isActiveAudio = playbackInfo && (props.data.aid === playbackInfo.audioId);

		self.setState({
			timeProgress: this.convertSecondsToReadableTime(this.props.data.duration)
		});

		if (isActiveAudio) {
			AudioPlayer.addPlayerHandlers({
				audioId: audioId
			});
		}

	}

	shouldComponentUpdate (newProps) {
		var shouldUpdate = this.props.playbackInfo !== newProps.playbackInfo;
		return shouldUpdate;
	}

	componentWillUnmount () {

		var self = this;

		self.removePlayerHandlers();

	}

	removePlayerHandlers () {

		var self = this;

		AudioPlayer.removePlayerHandlers({
			audioId: self.props.data.aid
		});
	}

	render () {

		var self  = this,
			props = self.props,
			state = self.state,
			playbackInfo,
			isActiveAudio,
			isPaused,
			isPLayingClassName,
			playingHandler,
			audioData,
			duration,
			actualTimeData,
			timeProgress,
			timelineProgress = 0,
			bufferedPercents = 0,
			currentTime = 0,
			buffered = 0,
			seekAudioHandler;

		audioData = props.data;
		duration = props.data.duration;

		playbackInfo = props.playbackInfo && props.playbackInfo.toObject() || null;

		isActiveAudio = playbackInfo && (props.data.aid === playbackInfo.audioId);
		isPaused = isActiveAudio && playbackInfo.paused;

		if (isActiveAudio) {
			currentTime = playbackInfo.currentTime;
			buffered = playbackInfo.buffered;
			seekAudioHandler = self.seekAudioProgress;
		}

		actualTimeData = self.getActualTime(currentTime, audioData.duration);
		timeProgress = actualTimeData.timeProgress;
		timelineProgress = actualTimeData.timelineProgress;
		bufferedPercents = self.getBufferingProgress(audioData.duration, buffered);

		isPLayingClassName 	= isActiveAudio && !isPaused ? 'mdi-av-pause' : 'mdi-av-play-arrow';
		playingHandler 	= isActiveAudio && !isPaused ? self.pause : self.play;





		return (
			<div className="audio-item clearfix">

				<div className="audio-item-audioplayer">

					<div className="audio-player clearfix">
						<div className="audio-controls">

							<a href="#" onClick={playingHandler}>
								<i className={isPLayingClassName}></i>
							</a>

							<a className="" href="#" onClick={self.stop}>
								<i className="mdi-av-stop"></i>
							</a>

						</div>

						<div className="audio-info">

							<div className="clearfix">
								<div className="audio-info-track-name">
									<span className="audio-info-artist">{audioData.artist}</span> - <span className="audio-info-title">{audioData.title}</span>
								</div>
								<div className="audio-info-duration" onClick={self.handleDecrease}>
									{isActiveAudio && state.decreaseTime ? '-' : ''} {timeProgress}
								</div>
							</div>

							<div className="audio-timeline-holder progress progress-striped active" onClick={seekAudioHandler}>
								<div className="audio-buffered" style={{width: bufferedPercents + '%'}}></div>
								<div className="audio-timeline progress-bar" style={{width: timelineProgress + '%'}}></div>
							</div>

						</div>

					</div>
				</div>

				<ul className="audio-item-actions clearfix">
					<li>
						<a className="audio-download" target="_blank" onClick={self.download} href={audioData.url}>
							<i className="mdi-file-file-download"></i>
						</a>
					</li>
					<li>
						<a className="" title="Add to my audios" onClick={self.moveToAlbum}>
							<i className="mdi-av-my-library-add"></i>
						</a>
					</li>
				</ul>
			</div>
		);
	}

	download = (e) => {
		!!e && e.preventDefault();

		var self = this,
			audioData = self.props.data,
			trackName = self.prepareFileName(audioData.artist + ' ' + audioData.title),
			url = audioData.url;


		chrome.downloads.download({
			url: url,
			filename: trackName,
			saveAs: true
		});
	}

	play = (e) => {

		!!e && e.preventDefault();

		var self = this,
			audioId;

		audioId = self.props.data.aid;

		AppActions.playAudioById(audioId);

		AudioPlayer.play({
			component: self,
			audioId: audioId
		});
	}

	pause = (e) => {

		!!e && e.preventDefault();

		AppActions.pauseAudio();

		AudioPlayer.pause();

	}

	stop = (e) => {

		!!e && e.preventDefault();

		var self = this;

		AppActions.stopAudio();

		AudioPlayer.stop({
			audioId: self.props.data.aid
		});

	}

	seekAudioProgress = (e) => {

		e.preventDefault();

		var self = this,
			progressHolder,
			progressHolderWidth,
			progressHolderBoundings,
			progressHolderLeftPosition,
			clickPositionX,
			clickPercent;

		progressHolder = e.target;
		progressHolderWidth = progressHolder.offsetWidth;
		progressHolderBoundings = progressHolder.getBoundingClientRect();
		progressHolderLeftPosition = progressHolderBoundings.left;
		clickPositionX = e.clientX;
		clickPercent = (Math.abs(clickPositionX - progressHolderLeftPosition) / progressHolderWidth);

		AudioPlayer.updateCurrentTime({
			percents: clickPercent
		});

	}

	getBufferingProgress (duration, buffered) {

		var self = this,
			bufferedLength,
			bufferedEnd,
			bufferedPercents;

		bufferedLength = buffered.length;
		if (!bufferedLength) return;
		bufferedEnd = buffered.end(bufferedLength - 1);

		bufferedPercents = (bufferedEnd / duration) * 100;

		return bufferedPercents;

		//self.setState({
		//	bufferedPercents: bufferedPercents
		//});

	}

	getActualTime (currentTime, duration) {
		var timelineProgress,
			timeProgress;

		timelineProgress = ((currentTime / duration) * 100).toFixed(2);
		timeProgress = this.state.decreaseTime
			? Math.floor(duration - currentTime)
			: Math.floor(currentTime);

		return {
			timeProgress: this.convertSecondsToReadableTime(timeProgress),
			timelineProgress: timelineProgress
		}

		//this.setState({
		//	timelineProgress: timelineProgress,
		//	timeProgress: this.convertSecondsToReadableTime(timeProgress)
		//});
	}

	convertSecondsToReadableTime (time) {
		var days,
			hours,
			minutes,
			seconds;

		time = parseInt(time, 10);
		if (!time || Object.prototype.toString.call(time).slice(8, -1) !== 'Number') return '00m 00s';

		days 	= Math.floor(time / (3600 * 24)) || 0;
		hours 	= Math.floor((time % (3600 * 24)) / 3600) || 0;
		minutes = Math.floor((time % (3600 * 24) % 3600) / 60) || 0;
		seconds = Math.floor(time % (3600 * 24) % 3600 % 60) || 0;

		minutes = minutes + '';
		minutes = minutes.length === 1 ? '0' + minutes : minutes;
		seconds = seconds + '';
		seconds = seconds.length === 1 ? '0' + seconds : seconds;

		return (days ? days + 'd ' : '') + (hours ? hours + 'h ' : '') + (minutes + 'm ') + (seconds + 's');
	}

	handleDecrease = () => {

		var decreaseStatus = this.state.decreaseTime;
		this.setState({
			decreaseTime: !decreaseStatus
		});
	}

	resetState () {
		var self = this;

		self.removePlayerHandlers();

		self.setState({
			//isPlaying: false,
			timelineProgress: 0,
			decreaseTime: true,
			timeProgress: self.convertSecondsToReadableTime(self.props.data.duration),
			bufferedPercents: 0
		});
	}

	moveToAlbum = (e) => {

		var self =this;

		!!e && e.preventDefault();

		AppActions.moveToAlbum(self.props.data.aid);
	}

	playAudio () {
		this.play();
	}

	resetAudio () {
		this.resetState();
	}

	prepareFileName (input) {
		return input.replace(/[^\d\wа-я\-\.]+/gi, '_') + '.mp3';
	}

};

export default AudioItem;