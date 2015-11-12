/**
 * @namespace audioData.artist
 */
'use strict';

import React from 'react';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import AudioPlayer from '../../player/audio-player.js';
import ChromeProvider from '../../providers/provider-chrome.js';
import CircleProgressBar from './app-content-progress-bar-circle.js';
import {Map} from 'immutable';
import AppUtils from '../../utils/app-utils';

class AudioItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAdded: null
		};
	}

	componentWillMount () {

	}

	componentDidMount () {

	}

	shouldComponentUpdate (newProps, newState) {

		var props = this.props,
			updateState,
			updatePlaybackInfo,
			updateDownloadProgress,
			shouldUpdate,
			includesActualDownloadProgress,
			hasActualDownloadProgress,
			willLoseActualDownloadProgress,
			hadActualDownloadProgress;

		updateState = this.state.isAdded !== newState.isAdded;

		updatePlaybackInfo = props.playbackInfo !== newProps.playbackInfo;
		updateDownloadProgress = !!newProps.downloadProgress && (props.downloadProgress !== newProps.downloadProgress);

		includesActualDownloadProgress = !!updateDownloadProgress && (newProps.downloadProgress.filter((v) => v.get('url') === props.data.url)).size > 0;
		hasActualDownloadProgress = !!props.downloadProgress && (props.downloadProgress.filter((v) => v.get('url') === props.data.url)).size > 0;
		willLoseActualDownloadProgress = !!newProps.downloadProgress && (newProps.downloadProgress.filter((v) => v.get('url') === props.data.url)).size === 0;
		hadActualDownloadProgress = hasActualDownloadProgress && willLoseActualDownloadProgress;

		shouldUpdate = updateState || updatePlaybackInfo || (updateDownloadProgress && includesActualDownloadProgress) || hadActualDownloadProgress;

		return shouldUpdate;
	}

	componentWillUnmount () {

	}

	render () {

		var props = this.props,
			state = this.state,
			playbackInfo,
			isActiveAudio,
			isActiveClassName = '',
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
			decreaseHandler,
			downloadProgress,
			downloadProgressData,
			percentsLoaded,
			couldBeAddedToAlbum;

		audioData = props.data;
		duration = props.data.duration;

		playbackInfo = props.playbackInfo && props.playbackInfo.toObject() || {};

		isActiveAudio = props.data.aid === playbackInfo.audioId;
		isPaused = isActiveAudio && !!playbackInfo.paused;

		if (isActiveAudio) {
			isActiveClassName = 'active-item';
			currentTime = playbackInfo.currentTime;
			buffered = playbackInfo.buffered;
			seekAudioHandler = this.seekAudioProgress;
		}

		actualTimeData = this.getActualTime(currentTime, duration);

		timeProgress = actualTimeData.timeProgress;
		timelineProgress = actualTimeData.timelineProgress;

		bufferedPercents = this.getBufferingProgress(duration, buffered);


		isPLayingClassName 	= isActiveAudio && !isPaused ? 'mdi-av-pause' : 'mdi-av-play-arrow';
		playingHandler 	= isActiveAudio && !isPaused ? this.pause : this.play;

		stopHandler = isActiveAudio ? this.stop : (e) => {e.preventDefault()};
		decreaseHandler = isActiveAudio ? this.toggleDecrease : (e) => {e.preventDefault()};

		downloadProgress = props.downloadProgress && props.downloadProgress.size > 0 && props.downloadProgress.filter((v) => v.get('url') === audioData.url).take(1);
		downloadProgressData = downloadProgress && downloadProgress.size > 0 && downloadProgress.toObject();
		downloadProgressData = downloadProgressData && downloadProgressData[Object.keys(downloadProgressData)[0]];

		couldBeAddedToAlbum = ((props.contentType === 'search') && (!props.isInPlaylist)) && !state.isAdded;

		return (
			<div className={"audio-item clearfix " + isActiveClassName} onClick={this.setAudioItemSelected}>

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
					<li className={downloadProgressData && downloadProgressData.get('state')}>
						{!!downloadProgressData
							? 	downloadProgressData.get('percentsLoaded') < 100

								? 	<CircleProgressBar percents={downloadProgressData.get('percentsLoaded')} />

								: 	<a className="audio-item-open-folder" onClick={this.show.bind(this, downloadProgressData.get('id'))}>
										<span className="mdi-file-folder-open"></span>
									</a>

							: 	<a className="audio-download" target="_blank" onClick={this.download} href={audioData.url} title="Download track">
									<i className="mdi-file-file-download"></i>
								</a>
						}

					</li>
					<li>
						{!!couldBeAddedToAlbum

							? 	<a className="" title="Add to my audios" onClick={this.addToAlbum}>
									<i className="mdi-av-my-library-add"></i>
								</a>

							:	(state.isAdded === true)

								? 	<a className="" title="Remove from audios">
										<i className="mdi-action-done"></i>
									</a>

								: 	<a className="" title="Remove from audios" onClick={this.removeFromAlbum}>
										<i className="mdi-navigation-cancel"></i>
									</a>

						}

					</li>
				</ul>
			</div>
		);
	}

	setAudioItemSelected = (e) => {

		!!e && e.preventDefault();

		AppActions.setAudioItemSelected({
			audioId: this.props.data.aid,
			lyricsId: +this.props.data.lyrics_id
		});
	};

	download = (e) => {

		!!e && e.preventDefault();

		var audioData = this.props.data,
			filename = this.prepareFileName(audioData.artist + ' ' + audioData.title),
			url = audioData.url;

		ChromeProvider.downloadFile({filename, url});

	};

	show = (downloadId) => {
		ChromeProvider.showDownloadedFile(downloadId);
	};

	play = (e) => {

		!!e && e.preventDefault();

		var audioId;

		audioId = this.props.data.aid;

		AppActions.playAudioById(audioId);

		AudioPlayer.play({
			audioId: audioId
		});
	};

	pause = (e) => {

		!!e && e.preventDefault();

		AppActions.pauseAudio();

		AudioPlayer.pause();

	};

	stop = (e) => {

		!!e && e.preventDefault();

		var self = this;

		AppActions.stopAudio();

		AudioPlayer.stop({
			audioId: self.props.data.aid
		});

	};

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

	};

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



		timelineProgress = ((currentTime / duration) * 100).toFixed(1);
		timeProgress = decreaseTime
			? Math.floor(duration - currentTime)
			: Math.floor(currentTime);

		return {
			timeProgress: AppUtils.convertSecondsToReadableTime((timeProgress || duration) | 0),
			timelineProgress: timelineProgress
		}
	}

	toggleDecrease = () => {

		AppActions.toggleDecrease();

	};

	addToAlbum = (e) => {

		!!e && e.preventDefault();
		//groupId, albumId, audioId
		AppActions.addToAlbum({
			audioId: this.props.data.aid,
			ownerId: this.props.data.owner_id
		});
		this.setState({
			isAdded: true
		});
		AppActions.updateSearchResults();
	};

	removeFromAlbum = (e) => {

		!!e && e.preventDefault();

		AppActions.removeFromAlbum({
			audioId: this.props.data.aid,
			ownerId: this.props.data.owner_id
		});

	};

	prepareFileName (input) {

		return input.replace(/[^\d\wа-яё\-\.]+/gi, '_') + '.mp3';

	}

};

export default AudioItem;