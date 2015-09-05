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
		this.state = {
			isPlaying: false,
			timelineProgress: 0,
			decreaseTime: true,
			timeProgress: 0,
			bufferedPercents: 0
		};
	}

	componentDidMount () {

		var self = this;

		self.setState({
			timeProgress: this.convertSecondsToReadableTime(this.props.data.duration)
		});

		AudioPlayer.addPlayerHandlers({
			audioId: self.props.data.aid,
			onTimeUpdate: self.updateTime.bind(self),
			onProgress: self.updateBufferingProgress.bind(self)
		});

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
			isPlaying,
			isPLayingClassName,
			isPLayingHandler,
			audioData,
			duration;

		isPlaying = state.isPlaying;
		isPLayingClassName 	= isPlaying ? 'mdi-av-pause' : 'mdi-av-play-arrow';
		isPLayingHandler 	= isPlaying ? self.pause : self.play;

		audioData = this.props.data;
		duration = audioData.duration;

		return (
			<div className="audio-item clearfix">

				<div className="audio-item-audioplayer">

					<div className="audio-player clearfix">
						<div className="audio-controls">

							<a href="#" onClick={isPLayingHandler.bind(self)}>
								<i className={isPLayingClassName}></i>
							</a>

							<a className="" href="#" onClick={self.stop.bind(self)}>
								<i className="mdi-av-stop"></i>
							</a>

						</div>

						<div className="audio-info">

							<div className="clearfix">
								<div className="audio-info-track-name">
									<span className="audio-info-artist">{audioData.artist}</span> - <span className="audio-info-title">{audioData.title}</span>

								</div>
								<div className="audio-info-duration" onClick={self.handleDecrease.bind(self)}>
									{state.isPlaying && state.decreaseTime ? '-' : ''} {state.timeProgress}
								</div>
							</div>

							<div className="audio-timeline-holder progress progress-striped active" onClick={self.seekAudioProgress.bind(self)}>
								<div className="audio-buffered" style={{width: state.bufferedPercents + '%'}}></div>
								<div className="audio-timeline progress-bar" style={{width: state.timelineProgress + '%'}}></div>
							</div>

						</div>

					</div>
				</div>

				<ul className="audio-item-actions clearfix">
					<li>
						<a className="audio-download" target="_blank" download href={audioData.url}>
							<i className="mdi-file-file-download"></i>
						</a>
					</li>
					<li>
						<a className="" href="#" title="Add to my audios">
							<i className="mdi-av-my-library-add" onClick={self.moveToAlbum.bind(self)}></i>
						</a>
					</li>
				</ul>
			</div>
		);
	}

	play (e) {

		!!e && e.preventDefault();

		var self = this;

		AudioPlayer.play({
			component: self,
			audioId: self.props.data.aid,
			onTimeUpdate: self.updateTime.bind(self),
			onProgress: self.updateBufferingProgress.bind(self)
		});

		self.setState({isPlaying: true});
	}

	pause (e) {

		!!e && e.preventDefault();

		AudioPlayer.pause();

		this.setState({isPlaying: false});
	}

	stop (e) {

		!!e && e.preventDefault();

		var self = this;

		self.setState({isPlaying: false});
		AudioPlayer.stop({
			audioId: self.props.data.aid
		});

	}

	seekAudioProgress (e) {

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
			audioId: self.props.data.aid,
			percents: clickPercent
		});

	}

	updateBufferingProgress (duration, buffered) {

		var self = this,
			bufferedLength,
			bufferedEnd,
			bufferedPercents;

		bufferedLength = buffered.length;
		if (!bufferedLength) return;
		bufferedEnd = buffered.end(bufferedLength - 1);

		bufferedPercents = (bufferedEnd / duration) * 100;

		self.setState({
			bufferedPercents: bufferedPercents
		});

	}

	updateTime (currentTime, duration) {
		var timelineProgress,
			timeProgress;

		timelineProgress = ((currentTime / duration) * 100).toFixed(2);
		timeProgress = this.state.decreaseTime
			? Math.floor(duration - currentTime)
			: Math.floor(currentTime);

		this.setState({
			timelineProgress: timelineProgress,
			timeProgress: this.convertSecondsToReadableTime(timeProgress)
		});
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

	handleDecrease () {

		var decreaseStatus = this.state.decreaseTime;
		this.setState({
			decreaseTime: !decreaseStatus
		});
	}

	resetState () {
		var self = this;

		self.removePlayerHandlers();

		self.setState({
			isPlaying: false,
			timelineProgress: 0,
			decreaseTime: true,
			timeProgress: self.convertSecondsToReadableTime(self.props.data.duration),
			bufferedPercents: 0
		});
	}

	moveToAlbum (e) {

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

};

export default AudioItem;