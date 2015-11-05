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

		self.player = new Audio();

		self.player.preload = 'auto';

		self.player.src = '';

		self.isPLaying = false;

		self.bindPlayerEvents();

	}

	bindPlayerEvents () {

		var self = this,
			player = self.player;

		player.ontimeupdate = function () {
			AppActions.updatePlayerTime(player.currentTime);
		};
		player.onprogress = function () {
			AppActions.updatePlayerBuffered(player.buffered);
		};

		player.addEventListener('ended', self.playNext);

	}

	loadAudioList (audioList) {

		var self = this;

		self.audioList = audioList || [];

		if (!self.audioList.length) {
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
			AppStore.changeCurrentAudioId(audioId, false);
		}



		audioList = self.audioList;
		audioListMap = self.audioListMap;
		player = self.player;

		audioIndex = self.getCurrentAudioIndex(audioId);

		audioData = audioList[audioIndex];

		self.currentAudioId = audioId;

		player.src = audioData.url;

		player.play();

		self.isPLaying = true;

	}

	pause () {

		var self = this,
			player = self.player;

		self.isPLaying && player.pause();

		self.isPLaying = false;
	}

	stop () {

		var self = this,
			player = self.player;

		player.pause();
		player.currentTime = 0;

		AppActions.updatePlayerTime(0);
		AppActions.updatePlayerBuffered(0);

		self.isPLaying = false;

	}

	playPrevious () {
		// TODO
	}

	playNext = () => {

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

		AppActions.playAudioById(nextAudioId);

		self.play({
			audioId: nextAudioId
		});

	}

	updateCurrentTime (data) {

		var self = this,
			audioId,
			percents,
			newTime;

		percents = data.percents;
		newTime = self.player.duration * percents;

		self.player.currentTime = newTime;
	}

	getCurrentAudioIndex (audioId) {

		var self = this,
			audioListMap;

		audioListMap = self.audioListMap;

		return audioId && audioListMap.hasOwnProperty(audioId) ? audioListMap[audioId] : 0;

	}

}

export default new AudioPlayer();
