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
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, this.processAudio);
	},
	componentWillUnmount() {
		AppStore.removeChangeListener(this.processAudio);
	},
	componentDidMount () {
		AppStore.getMyAudios();
	},
	processAudio () {
		this.setState({
			personalList: AppStore.personalList
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