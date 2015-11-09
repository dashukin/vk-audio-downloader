'use strict';

import AppDispatcher from '../dispatchers/app-dispatcher.js';
import AppActions from '../actions/app-actions.js';
import AppConstants from '../constants/app-constants.js';
import {EventEmitter} from 'events';
import VKProvider from '../providers/provider-vk.js';
import ChromeProvider from '../providers/provider-chrome.js';
import AudioPlayer from '../player/audio-player.js';
import {Map, Record} from 'immutable';

class AppStore extends EventEmitter {

	constructor (props) {

		super(props);

		AppDispatcher.register((payload) => {

			switch (payload.actionType) {
				case AppConstants.LOG_OUT:
					this.logout();
					break;
				case AppConstants.PROCESS_USERS_DATA:
					this.processUsersData();
					break;
				case AppConstants.GET_PERSONAL_AUDIOS:
					this.getPersonalAudios(payload.refresh);
					break;
				case AppConstants.SEARCH_AUDIO:
					this.searchAudios(payload.query);
					break;
				case AppConstants.UPDATE_SEARCH_RESULTS:
					this.updateSearchResult();
					break;
				case AppConstants.ADD_TO_ALBUM:
					//this.moveToAlbum(null, null, payload.audioId);
					this.addToAlbum(payload.data);
					break;
				case AppConstants.REMOVE_FROM_ALBUM:
					this.removeFromAlbum(payload.data);
					break;
				case AppConstants.PLAY_AUDIO_BY_ID:
					this.playAudioById(payload.audioId);
					break;
				case AppConstants.PAUSE_AUDIO:
					this.pauseAudio();
					break;
				case AppConstants.STOP_AUDIO:
					this.stopAudio();
					break;
				case AppConstants.UPDATE_PLAYBACK_TIME:
					this.updatePlaybackTime(payload.currentTime);
					break;
				case AppConstants.UPDATE_PLAYBACK_BUFFERED:
					this.updatePlaybackBuffered(payload.buffered);
					break;
				case AppConstants.TOGGLE_DECREASE:
					this.toggleDecrease();
					break;
				case AppConstants.TRACK_DOWNLOAD_PROGRESS:
					this.trackDownloadProgress(payload.downloadProgress);
					break;
			}
			return true;
		});
	}

	storeData = {
		authState: 'loading',
		userInfo: Map({
			authorized: false,
			firstName: '',
			lastName: '',
			personalAudiosCount: 0
		}),
		playbackInfo: Map({
			audioId: null,
			paused: false,
			decreaseTime: true,
			currentTime: 0,
			buffered: 0
		}),
		downloadProgress: null,
		personalAudios: [],
		searchQuery: '',
		searchResults: [],
		shouldSearchBeUpdated: false,
		currentAudioId: null,
		currentPlayList: null,
		shouldRefreshSearch: false
	}

	emitChange (changeEvent) {
		this.emit(changeEvent || AppConstants.CHANGE_EVENT);
	}

	addChangeListener (changeEvent, callback) {
		this.on(changeEvent || AppConstants.CHANGE_EVENT, callback);
	}

	removeChangeListener (changeEvent, callback) {
		this.removeListener(changeEvent || AppConstants.CHANGE_EVENT, callback);
	}

	initVK () {

		VKProvider.checkAppPermissions(() => {
			this.processUsersData();
		});

	}

	logout () {
		var self = this;
		ChromeProvider.clearUsersCredentials({
			success () {
				document.location.reload();
			}
		});
	}

	processUsersData () {

		var storeData = this.storeData;

		VKProvider.getUserInfo((data) => {

			let {firstName, lastName} = data;

			storeData.userInfo = storeData.userInfo.update('firstName', () => firstName);
			storeData.userInfo = storeData.userInfo.update('lastName', () => lastName);

			this.emitChange();
		});

		this.getPersonalAudios();
		this.getAlbums();
	}

	getAlbums () {

		VKProvider.getAlbums((r) => {

		});
	}

	addToAlbum (data) {
		data.success = () => {
			this.getPersonalAudios(true);
		};
		VKProvider.addToAlbum(data);
	}

	removeFromAlbum (data) {
		data.success = () => {
			this.getPersonalAudios(true);
		}
		VKProvider.removeFromAlbum(data);
	}

	getPersonalAudios (refresh) {

		var storeData = this.storeData;

		if (!this.storeData.personalAudios.length || !!refresh) {
			VKProvider.getAudios((data) => {
				storeData.personalAudios = data.audios; // TODO: create ability to load someone's audios
				storeData.currentAudioList = data.audios;
				AudioPlayer.loadAudioList(storeData.currentAudioList);

				this.searchAudios(this.storeData.searchQuery);

				this.emitChange();
			});

			this.getPersonalAudiosCount();

		} else {
			this.emitChange();
		}
	}

	getPersonalAudiosCount () {

		var storeData = this.storeData;

		VKProvider.getCount({
			callback: ({count}) => {
				storeData.userInfo = storeData.userInfo.update('personalAudiosCount', () => count || 0);
				// TODO: refactor
				this.emitChange();
			}
		});
	}

	getAudioList (listType) {

		var audioList;

		switch (listType) {
			case 'search':
				audioList = this.storeData.searchResults;
				break;
			case 'personal':
				audioList = this.storeData.personalAudios;
				break;
		}

		this.changeCurrentPlayList(listType);

		return audioList;

	}

	searchAudios (query) {
		this.storeData.searchQuery = query;
		VKProvider.searchAudios(query, (data) => {
			this.storeData.searchResults = data.searchResults;
			AudioPlayer.loadAudioList(data.searchResults);
			this.emitChange();
		});
	}

	updateSearchResult () {
		console.warn('updateSearchResult');
		this.storeData.shouldSearchBeUpdated = true;
	}

	getSearchQuery () {
		return this.storeData.searchQuery || '';
	}

	getSearchResults () {
		return this.storeData.searchResults || [];
	}

	changeCurrentAudioId (audioId, emitChange) {
		this.storeData.currentAudioId = audioId;
		(emitChange !== false) &&this.emitChange(AppConstants.CHANGE_EVENT);
	}

	getCurrentAudioId () {
		return this.storeData.currentAudioId;
	}

	playAudioById (audioId) {
		//this.storeData.playbackInfo.audioId = audioId;
		//this.storeData.playbackInfo.paused = false;

		this.storeData.playbackInfo = this.storeData.playbackInfo.update('audioId', () => audioId);
		this.storeData.playbackInfo = this.storeData.playbackInfo.update('paused', () => false);

		this.emitChange();
	}

	pauseAudio () {
		//this.storeData.playbackInfo.paused = true;

		this.storeData.playbackInfo = this.storeData.playbackInfo.update('paused', () => true);

		this.emitChange();
	}

	stopAudio () {
		//this.storeData.playbackInfo.audioId = null;

		this.storeData.playbackInfo = this.storeData.playbackInfo.update('audioId', () => null);

		this.emitChange();
	}

	updatePlaybackTime (currentTime) {

		//this.storeData.playbackInfo.currentTime = currentTime;

		this.storeData.playbackInfo = this.storeData.playbackInfo.update('currentTime', () => currentTime);

		this.emitChange();
	}

	updatePlaybackBuffered (buffered) {
		//this.storeData.playbackInfo.buffered = buffered;

		this.storeData.playbackInfo = this.storeData.playbackInfo.update('buffered', () => buffered);

		this.emitChange();
	}

	changeCurrentPlayList (listType) {

		var storeData = this.storeData;

		switch (listType) {
			case 'personal':
				storeData.currentPlayList = storeData.personalAudios;
				break;
			case 'search':
				storeData.currentPlayList = storeData.searchResults;
				break;
		}

		AudioPlayer.loadAudioList(this.storeData.currentPlayList);

	}

	getCurrentPlayList () {
		return this.storeData.currentPlayList;
	}

	toggleDecrease () {
		//this.storeData.playbackInfo.decreaseTime = !this.storeData.playbackInfo.decreaseTime;

		this.storeData.playbackInfo = this.storeData.playbackInfo.update('decreaseTime', () => !this.storeData.playbackInfo.get('decreaseTime'));

		this.emitChange();
	}

	trackDownloadProgress (downloadProgress) {
		this.storeData.downloadProgress = downloadProgress;
		this.emitChange();
	}

};

export default new AppStore();