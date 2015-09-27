/*
* Audio player
* */

'use strict';

import AppActions from '../actions/app-actions.js';
import AppConstants from '../constants/app-constants.js';
import AppStore from '../stores/app-store.js';

class AudioPlayer {

	constructor (props) {

		var self = this;

		self.audioList = [];

		self.audioListMap = {};

		self.currentAudioId = null;

		// link to current playing component
		self.currentAudioComponent = null;

		self.player = new Audio();

		self.player.preload = 'auto';

		self.player.src = '';

		self.isPLaying = false;

		self.bindPlayerEvents();

	}

	bindPlayerEvents () {

		var self = this,
			player = self.player;

		player.addEventListener('ended', self.playNext.bind(self));

	}

	loadAudioList (audioList) {

		var self = this;

		self.audioList = audioList;

		if (!audioList.length) {
			self.audioListMap = {};
		} else {
			// store audio id and it's index
			audioList.map(function (audioData, index) {
				self.audioListMap[audioData.aid] = index;
			});
		}

	}

	updatePlaylist () {

		var self = this,
			currentPlaylist;

		currentPlaylist = AppStore.getCurrentPlayList();

		self.loadAudioList(currentPlaylist);

	}

	play (data) {

		var self = this,
			audioId,
			audioListMap,
			audioList,
			audioIndex,
			player,
			audioData;

		audioId = data.audioId;

		if (self.currentAudioId === audioId) {
			if (!self.isPlaying) {
				self.player.play();
				self.isPLaying = true;
			}
			return;
		} else {
			AppStore.resetAudioState(audioId);
			AppStore.changeCurrentAudioId(audioId, false);
		}



		self.removePlayerHandlers(data);
		// call reset method on currently playing component
		//self.currentAudioComponent && self.currentAudioComponent.resetState();

		console.info('gonna call resetAudioState');
		AppActions.resetAudioState(self.currentAudioId);

		self.currentAudioComponent = data.component;

		audioList = self.audioList;
		audioListMap = self.audioListMap;
		player = self.player;

		audioIndex = self.getCurrentAudioIndex(audioId);

		audioData = audioList[audioIndex];

		self.currentAudioId = audioId;

		player.src = audioData.url;

		self.addPlayerHandlers(data);

		player.play();

		self.isPLaying = true;

	}

	addPlayerHandlers (data) {

		var self = this,
			player = self.player;

		if (self.currentAudioId !== data.audioId) {
			return;
		}

		player.ontimeupdate = function () {
			data.onTimeUpdate(player.currentTime, player.duration);
		};
		player.onprogress = function () {
			data.onProgress(player.duration, player.buffered);
		};

	}

	removePlayerHandlers (data) {

		var self = this,
			player = self.player;

		if (self.currentAudioId !== data.audioId) {
			return;
		}

		player.ontimeupdate = null;
		player.onprogress = null;

	}

	pause () {

		var self = this,
			player = self.player;

		self.isPLaying && player.pause();

		self.isPLaying = false;
	}

	stop (data) {

		var self = this,
			player = self.player,
			audioId = data.audioId;

		if (self.currentAudioId !== audioId) {
			return;
		}

		player.pause();
		player.currentTime = 0;

		self.isPLaying = false;

	}

	playPrevious () {

	}

	playNext () {

		var self = this,
			audioList,
			currentIndex,
			lastIndex,
			nextIndex,
			nextAudioId;

		audioList = self.audioList;
		currentIndex = self.getCurrentAudioIndex(self.currentAudioId);
		lastIndex = audioList.length - 1;
		nextIndex = currentIndex == null ? 0 : ((currentIndex + 1) <= lastIndex ? currentIndex + 1 : 0);
		nextAudioId = audioList[nextIndex].aid;

		AppStore.resetAudioState(self.currentAudioId);
		AppStore.changeCurrentAudioId(nextAudioId);

	}

	updateCurrentTime (data) {

		var self = this,
			audioId,
			percents,
			newTime;

		audioId = data.audioId;
		percents = data.percents;
		newTime = self.player.duration * percents;

		if (self.currentAudioId !== audioId) {
			return;
		}

		self.player.currentTime = newTime;
	}

	getCurrentAudioIndex (audioId) {

		var self = this,
			audioListMap;

		audioListMap = self.audioListMap;

		return audioId && audioListMap.hasOwnProperty(audioId) ? audioListMap[audioId] : 0;

	}

	getCurrentaudioId () {
		return this.currentAudioId;
	}

	getCurrentPlayStatus () {
		return !!this.isPLaying;
	}

}

export default new AudioPlayer();
