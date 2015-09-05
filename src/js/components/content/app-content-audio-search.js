'use strict';

import React from 'react';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import AppStore from '../../stores/app-store.js';
import AudioItem from './app-content-audio-item.js';

let AppContentSearch = React.createClass({
	getInitialState () {
		return {
			searchQuery: '',
			searchResults: []
		}
	},
	componentWillMount () {

		var self = this;

		AppStore.changeCurrentPlayList('search');
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.processSearchResults);
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);

	},
	componentDidMount () {

		this.processSearchResults();

	},
	componentWillUnmount () {

		var self = this;

		AppStore.removeChangeListener(AppConstants.CHANGE_EVENT, self.processSearchResults);
		AppStore.removeChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);

	},
	processSearchResults () {

		var self = this,
			storeData = AppStore.storeData;

		self.setState({
			searchQuery: storeData.searchQuery,
			searchResults: storeData.searchResults
		});

	},
	searchHandler (e) {

		var query = e.target.value;

		AppActions.searchAudio(query);

	},

	playAudioById () {

		var self = this,
			currentAudioId,
			newAudioId;

		currentAudioId = self.state.currentAudioId;

		newAudioId = AppStore.getCurrentAudioId();

		if (newAudioId === currentAudioId) {
			console.info('called playAudioById on the same audio. returning...');
			return;
		}

		if (self.refs.hasOwnProperty(currentAudioId)) {
			self.refs[currentAudioId].resetState();
		}

		if (self.refs.hasOwnProperty(newAudioId)) {
			self.refs[newAudioId].playAudio();
			self.setState({
				currentAudioId: newAudioId
			});
		}

	},

	render () {

		var self = this,
			state = self.state,
			searchQuery,
			searchResults = state.searchResults;

		console.warn(state.searchQuery);

		searchQuery = state.searchQuery || '';

		searchResults = searchResults.length
			? 	searchResults.map((audioData) => {
					return <AudioItem data={audioData} key={audioData.aid} ref={audioData.aid} />
				})
			: searchQuery.length
				? 'Nothing found...'
				: 'Type to search...';

		return (
			<div className="container">
				<div>
					<p>Search block:</p>
					<input ref="searchInput" type="text" className="form-control" placeholder="Type here..." defaultValue={searchQuery} value={searchQuery} onKeyUp={this.searchHandler}/>
				</div>
				<div className="list-group search-results">
					{searchResults}
				</div>
			</div>
		);
	}
});

export default AppContentSearch;