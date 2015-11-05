'use strict';

import AppDispatcher from '../dispatchers/app-dispatcher.js';
import AppConstants from '../constants/app-constants.js';

let Actions = {
	changeView (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.CHANGE_VIEW,
			viewName: payload
		});
	},
	processUsersData () {
		AppDispatcher.dispatch({
			actionType: AppConstants.PROCESS_USERS_DATA
		});
	},
	processPersonalList (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.PROCESS_PERSONAL_LIST,
			personalList: payload
		});
	},
	getPersonalAudios (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.GET_PERSONAL_AUDIOS,
			refresh: payload
		});
	},
	searchAudios (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.SEARCH_AUDIO,
			query: payload
		});
	},
	updateSearchResults () {
		AppDispatcher.dispatch({
			actionType: AppConstants.UPDATE_SEARCH_RESULTS
		});
	},
	processSearchResults (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.PROCESS_SEARCH_RESULTS,
			searchResults: payload
		})
	},
	processRoutesHandler (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.PROCESS_ROUTES_HANDLER,
			routesHandler: payload
		});
	},
	addToAlbum (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.ADD_TO_ALBUM,
			data: payload
		});
	},
	removeFromAlbum (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.REMOVE_FROM_ALBUM,
			data: payload
		})
	},
	changeCurrentPlaylist (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.CHANGE_CURRENT_PLAYLIST,
			listType: payload
		})
	},
	resetAudioState (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.RESET_AUDIO_STATE,
			audioId: payload
		});
	},
	playAudioById (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.PLAY_AUDIO_BY_ID,
			audioId: payload
		})
	},
	pauseAudio () {
		AppDispatcher.dispatch({
			actionType: AppConstants.PAUSE_AUDIO
		});
	},
	stopAudio () {
		AppDispatcher.dispatch({
			actionType: AppConstants.STOP_AUDIO
		});
	},
	updatePlayerTime (payload) {
		AppDispatcher.dispatch({
			actionType: AppConstants.UPDATE_PLAYBACK_TIME,
			currentTime: payload
		});
	},
	updatePlayerBuffered (buffered) {
		AppDispatcher.dispatch({
			actionType: AppConstants.UPDATE_PLAYBACK_BUFFERED,
			buffered: buffered
		});
	},
	toggleDecrease () {
		AppDispatcher.dispatch({
			actionType: AppConstants.TOGGLE_DECREASE
		});
	},
	trackDownloadProgress (downloadProgress) {
		AppDispatcher.dispatch({
			actionType: AppConstants.TRACK_DOWNLOAD_PROGRESS,
			downloadProgress: downloadProgress
		})
	}
};

export default Actions;