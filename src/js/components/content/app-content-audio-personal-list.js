'use strict';
/**
 * @namespace audioData.aid
 */

import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppConstants from '../../constants/app-constants.js';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import AudioItem from '../content/app-content-audio-item.js';

let MyAudios = React.createClass({
	getInitialState () {
		return {
			personalList: [],
			limit: 20
		}
	},
	componentWillMount () {
		this.dispatcherToken = AppDispatcher.register(this.processAudio);
	},
	componentWillUnmount() {
		this.dispatcherToken && AppDispatcher.unregister(this.dispatcherToken);
	},
	componentDidMount () {
		let audios = this.state.personalList;
		if (!audios.length) {
			AppStore.getMyAudios();
		}
	},
	processAudio (payload) {
		if (payload.actionType !== AppConstants.PROCESS_PERSONAL_LIST) return;
		this.setState({
			personalList: payload.personalList
		});
	},
	render () {

		var personalList = this.state.personalList,
			personalListOutput;

		personalListOutput = !personalList.length ? 'Loading...' : this.state.personalList.map(function (audioData) {
			return <AudioItem data={audioData} key={audioData.aid} />
		});

		return (
			<div className="list-group">
				<p>My audios!</p>

				{personalListOutput}

			</div>
		);
	}
});

export default MyAudios;