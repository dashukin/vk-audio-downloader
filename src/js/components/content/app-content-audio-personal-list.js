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

		var self = this;

		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.processAudio);
	},
	componentWillUnmount() {

		var self = this;

		AppStore.removeChangeListener(self.processAudio);
	},
	componentDidMount () {
		this.processAudio();
	},
	processAudio () {
		this.setState({
			personalList: AppStore.storeData.personalAudios
		});
	},
	render () {

		var personalList = this.state.personalList,
			personalListOutput;

		personalListOutput = !personalList.length ? 'Loading...' : this.state.personalList.map(function (audioData) {
			return <AudioItem data={audioData} key={audioData.aid} />
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