/**
 * @namespace audioData.artist
 */
'use strict';

import React from 'react';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import AudioPlayer from '../../player/audio-player.js';

class AudioItem extends React.Component {

	constructor(props) {
		super(props);
	}

	componentWillMount () {

	}

	componentDidMount () {

	}

	shouldComponentUpdate (newProps) {
		return this.props.playbackInfo !== newProps.playbackInfo;
	}

	componentWillUnmount () {

	}

	render () {

		var props = this.props,
			playbackInfo,
			isActiveAudio,
			isPaused,
			isPLayingClassName,
			playingHandler,
			audioData,
			duration,
			actualTimeData,
			timeProgress,
			timelineProgress,
			bufferedPercents,
			currentTime = 0,
			buffered = 0,
			seekAudioHandler,
			stopHandler,
			decreaseHandler;

		audioData = props.data;
		duration = props.data.duration;

		playbackInfo = props.playbackInfo && props.playbackInfo.toObject() || {};

		isActiveAudio = props.data.aid === playbackInfo.audioId;
		isPaused = isActiveAudio && !!playbackInfo.paused;

		if (isActiveAudio) {
			currentTime = playbackInfo.currentTime;
			buffered = playbackInfo.buffered;
			seekAudioHandler = this.seekAudioProgress;
		}

		actualTimeData = this.getActualTime(currentTime, audioData.duration);

		timeProgress = actualTimeData.timeProgress;
		timelineProgress = actualTimeData.timelineProgress;

		bufferedPercents = this.getBufferingProgress(audioData.duration, buffered);


		isPLayingClassName 	= isActiveAudio && !isPaused ? 'mdi-av-pause' : 'mdi-av-play-arrow';
		playingHandler 	= isActiveAudio && !isPaused ? this.pause : this.play;

		stopHandler = isActiveAudio ? this.stop : (e) => {e.preventDefault()};
		decreaseHandler = isActiveAudio ? this.toggleDecrease : (e) => {e.preventDefault()};


		return (
			<div className="audio-item clearfix">

				<div className="audio-item-audioplayer">

					<div className="audio-player clearfix">
						<div className="audio-controls">

							<a href="#" onClick={playingHandler}>
								<i className={isPLayingClassName}></i>
							</a>

							<a className="" href="#" onClick={stopHandler}>
								<i className="mdi-av-stop"></i>
							</a>

						</div>

						<div className="audio-info">

							<div className="clearfix">
								<div className="audio-info-track-name">
									<span className="audio-info-artist">{audioData.artist}</span> - <span className="audio-info-title">{audioData.title}</span>
								</div>
								<div className="audio-info-duration" onClick={decreaseHandler}>
									{isActiveAudio && playbackInfo.decreaseTime ? '-' : ''} {timeProgress}
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
						<a className="audio-download" target="_blank" onClick={this.download} href={audioData.url}>
							<i className="mdi-file-file-download"></i>
						</a>
					</li>
					<li>
						<a className="" title="Add to my audios" onClick={this.moveToAlbum}>
							<i className="mdi-av-my-library-add"></i>
						</a>
					</li>
				</ul>
			</div>
		);
	}

	download = (e) => {

		!!e && e.preventDefault();

		var audioData = this.props.data,
			trackName = this.prepareFileName(audioData.artist + ' ' + audioData.title),
			url = audioData.url;


		chrome.downloads.download({
			url: url,
			filename: trackName,
			saveAs: true
		});
	}

	play = (e) => {

		!!e && e.preventDefault();

		var audioId;

		audioId = this.props.data.aid;

		AppActions.playAudioById(audioId);

		AudioPlayer.play({
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

		var progressHolder,
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

		var bufferedLength,
			bufferedEnd,
			bufferedPercents;

		bufferedLength = buffered.length;

		if (!bufferedLength) return;

		bufferedEnd = buffered.end(bufferedLength - 1);

		bufferedPercents = (bufferedEnd / duration) * 100;

		return bufferedPercents;

	}

	getActualTime (currentTime, duration) {
		var timelineProgress,
			timeProgress,
			playbackInfo = this.props.playbackInfo && this.props.playbackInfo.toObject() || {},
			decreaseTime = playbackInfo.decreaseTime || false;



		timelineProgress = ((currentTime / duration) * 100).toFixed(2);
		timeProgress = decreaseTime
			? Math.floor(duration - currentTime)
			: Math.floor(currentTime);

		return {
			timeProgress: this.convertSecondsToReadableTime(timeProgress || duration),
			timelineProgress: timelineProgress
		}
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

	toggleDecrease = () => {

		AppActions.toggleDecrease();

	}

	moveToAlbum = (e) => {

		!!e && e.preventDefault();

		AppActions.moveToAlbum(this.props.data.aid);
	}

	playAudio () {

		this.play();

	}

	prepareFileName (input) {

		return input.replace(/[^\d\wа-яё\-\.]+/gi, '_') + '.mp3';

	}

};

export default AudioItem;