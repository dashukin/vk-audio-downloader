/*
* Audio player
* */

'use strict';

class AudioPlayer {

	constructor (props) {

		this.audioList = [];

		this.audioListMap = {};

		this.currentAudioId = null;

		this.player = new Audio();

		this.player.preload = 'auto';

		this.player.src = '';

		this.isPLaying = false;

	}

	loadAudioList (audioList) {

		var self = this,
			i,
			iLen;

		self.audioList = audioList;

		// store audio id and it's index
		audioList.map(function (audioData, index) {
			self.audioListMap[audioData.aid] = index;
		});

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
		}

		audioList = self.audioList;
		audioListMap = self.audioListMap;
		player = self.player;

		if (!audioId) {
			audioIndex = 0;
		} else {
			audioIndex = audioListMap.hasOwnProperty(audioId) ? audioListMap[audioId] : 0;
		}

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

	prev () {

	}

	next () {

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

}

export default new AudioPlayer();
