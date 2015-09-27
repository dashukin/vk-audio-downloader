'use strict';

import AppDispatcher from '../dispatchers/app-dispatcher.js';
import AppActions from '../actions/app-actions.js';
import AppConstants from '../constants/app-constants.js';
import assign from 'object-assign';
import {EventEmitter} from 'events';
import VKProvider from '../providers/provider-vk.js';
import AudioPlayer from '../player/audio-player.js';

let AppStore = assign(EventEmitter.prototype, {
	emitChange (changeEvent) {
		this.emit(changeEvent || AppConstants.CHANGE_EVENT);
	},
	addChangeListener (changeEvent, callback) {
		this.on(changeEvent || AppConstants.CHANGE_EVENT, callback);
	},
	removeChangeListener (changeEvent, callback) {
		this.removeListener(changeEvent || AppConstants.CHANGE_EVENT, callback);
	},
	storeData: {
		authorized: false,
		firstName: '',
		lastName: '',
		personalAudiosCount: 0,
		personalAudios: [],
		searchQuery: '',
		searchResults: [],
		currentAudioId: null,
		currentPlayList: null
	},
	searchQuery: '',
	searchResults: [],
	initVK () {

		var self = this,
			storeData = self.storeData;

		VKProvider.checkAppPermissions(function () {
			self.processUsersData();
		});

	},

	processUsersData () {

		var self = this,
			storeData = self.storeData;

		VKProvider.getUserInfo(function (data) {
			storeData.firstName = data.firstName;
			storeData.lastName = data.lastName;
			self.emitChange();
		});
		self.getAudios();
		self.getAlbums();
	},

	getAlbums () {

		var self = this;

		VKProvider.getAlbums(function (r) {
		});
	},

	moveToAlbum (groupId, albumId, audioId) {
		VKProvider.moveToAlbum(groupId, albumId, audioId);
	},

	getAudios () {

		var self = this;

		if (!self.storeData.personalAudios.length) {
			VKProvider.getAudios(function (data) {
				self.storeData.personalAudios = data.audios; // TODO: create ability to load someone's audios
				self.storeData.currentAudioList = data.audios;
				AudioPlayer.loadAudioList(self.storeData.currentAudioList);
				self.emitChange();
			});
		} else {
			self.emitChange();
		}
	},
	searchAudios (query) {
		var self = this;

		VKProvider.searchAudios(query, function (data) {
			self.storeData.searchQuery = query;
			self.storeData.searchResults = data.searchResults;
			AudioPlayer.loadAudioList(data.searchResults);
			self.emitChange();
		});
	},
	getSearchQuery () {
		return this.storeData.searchQuery || '';
	},
	getSearchResults () {
		return this.storeData.searchResults || [];
	},
	changeCurrentAudioId (audioId, emitChange) {
		this.storeData.currentAudioId = audioId;
		(emitChange !== false) &&this.emitChange(AppConstants.CHANGE_EVENT);
	},
	getCurrentAudioId () {
		return this.storeData.currentAudioId;
	},

	changeCurrentPlayList: function (listType) {

		var self = this,
			storeData = self.storeData;

		switch (listType) {
			case 'personal':
				storeData.currentPlayList = storeData.personalAudios;
				break;
			case 'search':
				storeData.currentPlayList = storeData.searchResults;
				break;
		}

		AudioPlayer.loadAudioList(self.storeData.currentPlayList);

	},
	getCurrentPlayList () {
		return this.storeData.currentPlayList;
	},
	resetAudioState () {
		this.emitChange(AppConstants.RESET_AUDIO_STATE);
	},
	dispatcherIndex: AppDispatcher.register((payload) => {

		switch (payload.actionType) {
			case AppConstants.PROCESS_USERS_DATA:
				AppStore.processUsersData();
				break;
			case AppConstants.SEARCH_AUDIO:
				AppStore.searchAudios(payload.query);
				break;
			case AppConstants.MOVE_TO_ALBUM:
				AppStore.moveToAlbum(null, null, payload.audioId);
				break;
		}
		return true;
	})
});

export default AppStore;