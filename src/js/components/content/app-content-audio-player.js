'use strict';

import React from 'react';

class AudioPlayer extends React.Component{

	constructor (props) {
		super(props);
		this.state = {
			isPlaying: false,
			timelineProgress: 0,
			decreaseTime: true,
			timeProgress: 0
		};
	}

	componentDidMount () {
		this.player = null;
		this.setState({
			timeProgress: this.converSecondsToReadableTime(this.props.duration)
		});
	}

	componentWillUnmount () {
		this.player = null;
	}

	render () {

		return (
			<div className="audio-player clearfix">
				<div className="audio-controls">
					{!this.state.isPlaying
						? 	<a className="" href="#" onClick={this.play.bind(this)}>
								<i className="mdi-av-play-arrow"></i>
							</a>
						: 	<a className="" href="#" onClick={this.pause.bind(this)}>
								<i className="mdi-av-pause"></i>
							</a>
					}

					<a className="" href="#" onClick={this.stop.bind(this)}>
						<i className="mdi-av-stop"></i>
					</a>
				</div>

				<div className="audio-info">
					<div className="clearfix">
						<div className="audio-info-track-name">
							<span className="audio-info-artist">{this.props.artist}</span>
							<span className="audio-info-title">{this.props.title}</span>
						</div>
						<div className="audio-info-duration" onClick={this.handleDecrease.bind(this)}>
							{this.state.isPlaying && this.state.decreaseTime ? '-' : ''}
							{this.state.timeProgress}
						</div>
					</div>

					<div className="audio-timeline-holder">
						<div className="audio-timeline" style={{width: this.state.timelineProgress + '%'}}>

						</div>
					</div>
				</div>

			</div>
		);
	}

	handlePlayerStatus () {

	}

	play (e) {
		!!e && e.preventDefault();

		if (!this.player) {
			this.player = new Audio();
			this.player.preload = 'none';
			this.player.src = this.props.src;
			this.player.ontimeupdate = this.updateTime.bind(this);
		}

		this.setState({isPlaying: true});
		this.player.preload = 'auto';
		this.player.play();
	}

	pause (e) {
		!!e && e.preventDefault();
		this.setState({isPlaying: false});
		this.player.pause();
	}

	stop (e) {
		!!e && e.preventDefault();
		this.setState({isPlaying: false});
		this.player.preload = 'none';
		this.player.pause();
		this.player.currentTime = 0;
	}

	updateTime () {
		var timelineProgress,
			timeProgress;

		timelineProgress = ((this.player.currentTime / this.player.duration) * 100).toFixed(2);
		timeProgress = this.state.decreaseTime
			? Math.floor(this.player.duration - this.player.currentTime)
			: Math.floor(this.player.currentTime);

		this.setState({
			timelineProgress: timelineProgress,
			timeProgress: this.converSecondsToReadableTime(timeProgress)
		});
	}

	converSecondsToReadableTime (time) {
		var days,
			hours,
			minutes,
			seconds,
			readableTime;

		time = parseInt(time, 10);
		if (!time || Object.prototype.toString.call(time).slice(8, -1) !== 'Number') return '...';

		days = Math.floor(time / (3600 * 24)) || 0;
		hours = Math.floor((time % (3600 * 24)) / 3600) || 0;
		minutes = Math.floor((time % (3600 * 24) % 3600) / 60) || 0;
		seconds = Math.floor(time % (3600 * 24) % 3600 % 60) || 0;

		return (days ? days + 'd ' : '') + (hours ? hours + 'h ' : '') + (minutes ? minutes + 'm ' : '') + (seconds ? seconds + 's': '');
	}

	handleDecrease () {

		var decreaseStatus = this.state.decreaseTime;
		this.setState({
			decreaseTime: !decreaseStatus
		});
	}

};

export default AudioPlayer;