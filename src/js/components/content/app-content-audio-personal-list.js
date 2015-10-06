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

class MyAudios extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			personalAudios: []
		}
	}

	componentWillMount () {

		var self = this;

		AppStore.changeCurrentPlayList('personal');

		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);
		AppStore.addChangeListener(AppConstants.RESET_AUDIO_STATE, self.resetAudioState);

	}

	componentWillUnmount() {

		var self = this;

		AppStore.removeChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);
		AppStore.removeChangeListener(AppConstants.RESET_AUDIO_STATE, self.resetAudioState);
	}

	componentDidMount () {

	}

	playAudioById = () => {

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

	}

	resetAudioState = () => {

		var self = this,
			currentAudioId;

		currentAudioId = AppStore.storeData.currentAudioId;

		if (currentAudioId && self.refs.hasOwnProperty(currentAudioId)) {
			self.refs[currentAudioId].resetAudio();
		}

	}

	render () {

		var self = this,
			state = self.state,
			personalAudios = this.state.personalAudios, //self.props.route.personalAudios,
			personalListOutput;

		console.log(self.props);

		console.warn('personalList:', personalAudios);

		personalListOutput = !personalAudios.length ? 'Loading...' : personalAudios.map((audioData) => {
			return <AudioItem data={audioData} key={audioData.aid} ref={audioData.aid} />
		});

		return (
			<div className="container">
				<div className="list-group">

					{personalListOutput}

				</div>
			</div>
		);
	}
};

export default MyAudios;