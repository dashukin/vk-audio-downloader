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
	componentDidMount () {

		var self = this;

		self.processSearchResults();

		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.processSearchResults);

	},
	componentWillUnmount () {

		var self = this;

		AppStore.removeChangeListener(self.processSearchResults);

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
	render () {

		var self = this,
			state = self.state,
			searchQuery,
			searchResults = state.searchResults;

		searchQuery = state.searchQuery || '';

		searchResults = searchResults.length
			? 	searchResults.map((audioData) => {
					return <AudioItem data={audioData} key={audioData.aid} />
				})
			: searchQuery.length
				? 'Nothing found...'
				: 'Type to search...';

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