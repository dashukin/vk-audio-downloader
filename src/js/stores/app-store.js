'use strict';

import AppDispatcher from '../dispatchers/app-dispatcher.js';
import AppActions from '../actions/app-actions.js';
import AppConstants from '../constants/app-constants.js';
import assign from 'object-assign';
import {EventEmitter} from 'events';
import VKProvider from '../providers/provider-vk.js';
import AudioPlayer from '../player/audio-player.js';

let AppStore = assign(EventEmitter.prototype, {
	emitChange () {
		this.emit(AppConstants.CHANGE_EVENT);
	},
	addChangeListener (changeEvent, callback) {
		this.on(AppConstants.CHANGE_EVENT, callback);
	},
	removeChangeListener (callback) {
		this.removeListener(AppConstants.CHANGE_EVENT, callback);
	},
	storeData: {
		userId: null,
		firstName: '',
		lastName: '',
		personalAudiosCount: 0,
		personalAudios: [],
		searchQuery: '',
		searchResults: []
	},
	searchQuery: '',
	searchResults: [],
	initVK () {

		var self = this,
			storeData = self.storeData;

		VKProvider.init();

		console.log('VK inited.');
		console.log('Gonna run checkAuthorization on init...');

		VKProvider.checkAuthorization(function (data) {
			storeData.userId = data.userId;
			self.emitChange();
			VKProvider.checkAppPermissions(data.userId, function () {
				VKProvider.getUserInfo(storeData.userId, function (data) {
					storeData.firstName = data.firstName;
					storeData.lastName = data.lastName;
					self.emitChange();
				});
				self.getAudios();
			});
		});

	},

	getAudios (userId) {
		console.log('Getting personal list...');
		var self = this;

		userId = userId || self.storeData.userId;

		if (!self.storeData.personalAudios.length) {
			VKProvider.getAudios(userId, function (data) {
				console.log(data.audios);
				self.storeData.personalAudios = data.audios; // TODO: create ability to load someone's audios
				AudioPlayer.loadAudioList(data.audios);
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
	dispatcherIndex: AppDispatcher.register((payload) => {

		switch (payload.actionType) {
			case AppConstants.SEARCH_AUDIO:
				AppStore.searchAudios(payload.query);
				break;
		}
		return true;
	})
});

export default AppStore;