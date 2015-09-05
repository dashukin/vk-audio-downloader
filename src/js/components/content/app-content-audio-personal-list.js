'use strict';
/**
 * @namespace audioData.aid
 */

import React from 'react';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import AppStore from '../../stores/app-store.js';
import AudioItem from './app-content-audio-item.js';

let MyAudios = React.createClass({
	getInitialState () {
		return {
			personalList: [],
			limit: 20
		}
	},
	componentWillMount () {

		var self = this;

		AppStore.changeCurrentPlayList('personal');

		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.processAudio);
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);
		AppStore.addChangeListener(AppConstants.RESET_AUDIO_STATE, self.resetAudioState);

	},
	componentWillUnmount() {

		var self = this;

		AppStore.removeChangeListener(AppConstants.CHANGE_EVENT, self.processAudio);
		AppStore.removeChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);
		AppStore.removeChangeListener(AppConstants.RESET_AUDIO_STATE, self.resetAudioState);
	},
	componentDidMount () {
		this.processAudio();
	},
	processAudio () {
		this.setState({
			personalList: AppStore.storeData.personalAudios
		});
	},
	playAudioById () {

		var self = this,
			currentAudioId,
			newAudioId;

		currentAudioId = self.state.currentAudioId;

		newAudioId = AppStore.getCurrentAudioId();

		if (self.refs.hasOwnProperty(currentAudioId)) {
			self.refs[currentAudioId].resetAudio();
		}

		if (self.refs.hasOwnProperty(newAudioId)) {
			self.refs[newAudioId].playAudio();
			self.setState({
				currentAudioId: newAudioId
			});
		}

	},

	resetAudioState () {

		console.info('calling resetAudioState on personal list');

		var self = this,
			currentAudioId;

		currentAudioId = AppStore.storeData.currentAudioId;

		console.info('currentAudioId:', currentAudioId);

		if (currentAudioId && self.refs.hasOwnProperty(currentAudioId)) {
			console.error(self.refs[currentAudioId]);
			self.refs[currentAudioId].resetAudio();
		}

	},

	render () {

		var personalList = this.state.personalList,
			personalListOutput;

		personalListOutput = !personalList.length ? 'Loading...' : this.state.personalList.map(function (audioData) {
			return <AudioItem data={audioData} key={audioData.aid} ref={audioData.aid} />
		});

		return (
			<div className="container">
				<div className="list-group">
					<p>My audios!</p>

				{personalListOutput}

				</div>
			</div>
		);
	}
});

export default MyAudios;