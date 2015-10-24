'use strict';

import React from 'react';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import AppStore from '../../stores/app-store.js';
import AudioItem from './app-content-audio-item.js';

class AppContentSearch extends React.Component {

	constructor (props) {
		super(props);
	}

	state = {
		searchQuery: '',
		searchResults: []
	}

	componentWillMount () {

		var self = this;

		AppStore.changeCurrentPlayList('search');
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.processSearchResults);
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);
		AppStore.addChangeListener(AppConstants.RESET_AUDIO_STATE, self.resetAudioState);

	}

	componentDidMount () {

		this.setState({
			searchQuery: AppStore.storeData.searchQuery
		})
		this.processSearchResults();

		console.warn(this.props);

	}

	componentWillUnmount () {

		var self = this;

		AppStore.removeChangeListener(AppConstants.CHANGE_EVENT, self.processSearchResults);
		AppStore.removeChangeListener(AppConstants.CHANGE_EVENT, self.playAudioById);
		AppStore.removeChangeListener(AppConstants.RESET_AUDIO_STATE, self.resetAudioState);

	}

	processSearchResults = () => {

		var self = this,
			storeData = AppStore.storeData;

		self.setState({
			searchResults: storeData.searchResults
		});

	}

	searchHandler (e) {

		var query = e.target.value;

		AppActions.searchAudio(query);

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
			searchQuery,
			searchResults = state.searchResults;

		searchQuery = state.searchQuery;

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
					<input ref="searchInput" type="text" className="form-control" placeholder="Type here..." defaultValue={searchQuery} onKeyUp={this.searchHandler}/>
				</div>
				<div className="list-group search-results">
					{searchResults}
				</div>
			</div>
		);
	}
};

export default AppContentSearch;