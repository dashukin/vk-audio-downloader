'use strict';

import AppDispatcher from '../dispatchers/app-dispatcher.js';
import AppActions from '../actions/app-actions.js';
import AppConstants from '../constants/app-constants.js';
import {EventEmitter} from 'events';
import VKProvider from '../providers/provider-vk.js';
import AudioPlayer from '../player/audio-player.js';

class AppStore extends EventEmitter {

	constructor (props) {

		super(props);

		var self = this;

		this.storeData = {
			authState: 'loading',
				userInfo: {
				authorized: false,
					firstName: '',
					lastName: ''
			},
			playbackInfo: {
				audioId: null,
					paused: false,
					timelineProgress: 0,
					decreaseTime: true,
					timeProgress: 0,
					bufferedPercents: 0,
					currentTime: 0,
					buffered: 0
			},
			personalAudiosCount: 0,
				personalAudios: [],
				searchQuery: '',
				searchResults: [],
				currentAudioId: null,
				currentPlayList: null
		}

		AppDispatcher.register((payload) => {

			switch (payload.actionType) {
				case AppConstants.PROCESS_USERS_DATA:
					self.processUsersData();
					break;
				case AppConstants.SEARCH_AUDIO:
					self.searchAudios(payload.query);
					break;
				case AppConstants.MOVE_TO_ALBUM:
					self.moveToAlbum(null, null, payload.audioId);
					break;
				case AppConstants.PLAY_AUDIO_BY_ID:
					self.playAudioById(payload.audioId);
					break;
				case AppConstants.PAUSE_AUDIO:
					self.pauseAudio();
					break;
				case AppConstants.STOP_AUDIO:
					self.stopAudio();
					break;
				case AppConstants.UPDATE_PLAYBACK_TIME:
					self.updatePlaybackTime(payload.currentTime);
					break;
				case AppConstants.UPDATE_PLAYBACK_BUFFERED:
					self.updatePlaybackBuffered(payload.buffered);
					break;
			}
			return true;
		});
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

		var self = this,
			storeData = self.storeData;

		VKProvider.checkAppPermissions(function () {
			self.processUsersData();
		});

	}

	processUsersData () {

		var self = this,
			storeData = self.storeData;

		VKProvider.getUserInfo(function (data) {
			storeData.firstName = data.firstName;
			storeData.lastName = data.lastName;
			self.emitChange();
		});
		self.getPersonalAudios();
		self.getAlbums();
	}

	getAlbums () {

		var self = this;

		VKProvider.getAlbums(function (r) {

		});
	}

	moveToAlbum (groupId, albumId, audioId) {
		VKProvider.moveToAlbum(groupId, albumId, audioId);
	}

	getPersonalAudios () {

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
	}

	getAudioList (listType) {

		var self = this,
			audioList;

		switch (listType) {
			case 'search':
				audioList = self.storeData.searchResults;
				break;
			case 'personal':
				audioList = self.storeData.personalAudios;
				break;
		}

		return audioList;

	}

	searchAudios (query) {
		var self = this;

		VKProvider.searchAudios(query, function (data) {
			self.storeData.searchQuery = query;
			self.storeData.searchResults = data.searchResults;
			AudioPlayer.loadAudioList(data.searchResults);
			self.emitChange();
		});
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
		this.storeData.playbackInfo.audioId = audioId;
		this.storeData.playbackInfo.paused = false;
		this.emitChange();
	}

	pauseAudio () {
		this.storeData.playbackInfo.paused = true;
		this.emitChange();
	}

	stopAudio () {
		this.storeData.playbackInfo.audioId = null;
		this.emitChange();
	}

	updatePlaybackTime (currentTime) {
		this.storeData.playbackInfo.currentTime = currentTime;
		this.emitChange();
	}

	updatePlaybackBuffered (buffered) {
		this.storeData.playbackInfo.buffered = buffered;
		this.emitChange();
	}

	changeCurrentPlayList (listType) {

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

	}

	getCurrentPlayList () {
		return this.storeData.currentPlayList;
	}

	resetAudioState () {
		this.emitChange(AppConstants.RESET_AUDIO_STATE);
	}

};

export default new AppStore();