'use strict';

import React from 'react';
import ReactRouter from 'react-router';
import {Link} from 'react-router';
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
		this.dispatcherToken = AppDispatcher.register(this.processSearchResults);
		this.setState({
			searchQuery: AppStore.getSearchQuery(),
			searchResults: AppStore.getSearchResults()
		});
	},
	componentWillUnmount () {
		AppDispatcher.unregister(this.dispatcherToken);
	},
	processSearchResults (payload) {
		if (payload.actionType !== AppConstants.PROCESS_SEARCH_RESULTS) return;
		this.setState({
			searchResults: payload.searchResults
		});
	},
	searchHandler (e) {

		var query = e.target.value;

		AppActions.searchAudio(query);
	},
	render () {

		var searchQuery,
			searchResults;

		searchQuery = this.state.searchQuery || '';

		searchResults = this.state.searchResults.map((audioData) => {

			return <AudioItem data={audioData} key={audioData.aid} />

		});

		return (
			<div className="container">
				<div>
					<p>Search block:</p>
					<input ref="searchInput" type="text" className="form-control" placeholder="Type here..." defaultValue={searchQuery} onKeyUp={this.searchHandler}/>
				</div>
				<div className="list-group search-results">
					{searchResults}
				</div>
			</div>
		);
	}
});

export default AppContentSearch;