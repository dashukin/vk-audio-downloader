'use strict';

import React from 'react';
import AudioPlayer from '../../player/audio-player.js';

class AudioPlayerView extends React.Component{

	constructor (props) {
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
			timeProgress: this.convertSecondsToReadableTime(this.props.duration)
		});

		AudioPlayer.addPlayerHandlers({
			audioId: self.props.audioId,
			onTimeUpdate: self.updateTime.bind(self),
			onProgress: self.updateBufferingProgress.bind(self)
		});

	}

	componentWillUnmount () {

		var self = this;

		//var self = this,
		//	player = self.player;
		//
		//if (!player) {
		//	return;
		//}
		//
		//player.pause();
		//player.currentTime = 0;
		//player.src = '';
		//player.preload = 'none';
		//player.ontimeupdate = null;
		//player.onprogress = null;
		//self.player = null;

		AudioPlayer.removePlayerHandlers({
			audioId: self.props.audioId
		});

	}

	render () {

		var self  = this,
			props = self.props,
			state = self.state,
			isPlaying,
			isPLayingClassName,
			isPLayingHandler;

		isPlaying = state.isPlaying;
		isPLayingClassName 	= isPlaying ? 'mdi-av-pause' : 'mdi-av-play-arrow';
		isPLayingHandler 	= isPlaying ? self.pause : self.play;

		return (
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
							<span className="audio-info-artist">{props.artist}</span> - <span className="audio-info-title">{props.title}</span>

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
		);
	}

	handlePlayerStatus () {

	}

	play (e) {

		!!e && e.preventDefault();

		var self = this,
			player = self.player;

		AudioPlayer.play({
			audioId: self.props.audioId,
			onTimeUpdate: self.updateTime.bind(self),
			onProgress: self.updateBufferingProgress.bind(self)
		});

		//// init on demand
		//if (!player) {
		//	player = self.player = new Audio();
		//	player.preload = 'none';
		//	player.src = self.props.src;
		//	player.ontimeupdate = self.updateTime.bind(self);
		//	player.onprogress = self.updateBufferingProgress.bind(self);
		//}

		self.setState({isPlaying: true});
		//player.preload = 'auto';
		//player.play();
	}

	pause (e) {

		!!e && e.preventDefault();

		AudioPlayer.pause();

		this.setState({isPlaying: false});
		//this.player.pause();
	}

	stop (e) {

		!!e && e.preventDefault();

		var self = this/*,
			player = self.player*/;

		self.setState({isPlaying: false});
		AudioPlayer.stop({
			audioId: self.props.audioId
		});
		//player.preload = 'none';
		//player.pause();
		//player.currentTime = 0;

	}

	seekAudioProgress (e) {

		e.preventDefault();

		var self = this,
			player,
			progressHolder,
			progressHolderWidth,
			progressHolderBoundings,
			progressHolderLeftPosition,
			clickPositionX,
			clickPercent,
			newCurrentTime;

		progressHolder = e.target;
		progressHolderWidth = progressHolder.offsetWidth;
		progressHolderBoundings = progressHolder.getBoundingClientRect();
		progressHolderLeftPosition = progressHolderBoundings.left;
		clickPositionX = e.clientX;
		clickPercent = (Math.abs(clickPositionX - progressHolderLeftPosition) / progressHolderWidth);

		//player.currentTime = newCurrentTime;

		AudioPlayer.updateCurrentTime({
			audioId: self.props.audioId,
			percents: clickPercent
		})

	}

	updateBufferingProgress (duration, buffered) {

		var self = this,
			player,
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
		if (!time || Object.prototype.toString.call(time).slice(8, -1) !== 'Number') return '...';

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

};

export default AudioPlayerView;