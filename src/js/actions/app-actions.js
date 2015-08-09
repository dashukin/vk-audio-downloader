'use strict';

import AppDispatcher from '../dispatchers/app-dispatcher.js';
import AppConstants from '../constants/app-constants.js';

let Actions = {
	changeView (viewName) {
		AppDispatcher.dispatch({
			actionType: AppConstants.CHANGE_VIEW,
			viewName: viewName
		});
	},
	processPersonalList (personalList) {
		AppDispatcher.dispatch({
			actionType: AppConstants.PROCESS_PERSONAL_LIST,
			personalList: personalList
		});
	},
	searchAudio (query) {
		AppDispatcher.dispatch({
			actionType: AppConstants.SEARCH_AUDIO,
			query: query
		});
	},
	processSearchResults (searchResults) {
		AppDispatcher.dispatch({
			actionType: AppConstants.PROCESS_SEARCH_RESULTS,
			searchResults: searchResults
		})
	},
	processRoutesHandler (Handler) {
		AppDispatcher.dispatch({
			actionType: AppConstants.PROCESS_ROUTES_HANDLER,
			routesHandler: Handler
		});
	}
};

export default Actions;