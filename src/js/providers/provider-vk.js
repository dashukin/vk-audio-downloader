/** @namespace VK.Auth */
/** @namespace VK.Auth.login */
/** @namespace VK.Api.getLoginStatus */


'use strict';

import AppConstants from '../constants/app-constants.js';
import AppActions from '../actions/app-actions.js';

var VK = window.VK;

class VKProvider {

	timeoutId = null;
	lastCallTimestamp = null;
	accessToken = null;
	userId = null;
	requestsURL = 'https://api.vk.com/method/';
	authURL = 'https://oauth.vk.com/authorize?client_id=5060172&redirect_uri=https://oauth.vk.com/blank.html&display=page&scope=' + AppConstants.APP_PERMISSIONS + '&response_type=token&v=5.37';
	searchAudioXhrId = null;

	request (methodName, parameters, success, error) {

		var self = this,
			xhr,
			params = [],
			p;

		if (!self.accessToken || !self.userId) {
			return;
		}

		parameters = parameters || {};
		parameters.rand = (Math.random() * 1e5) | 0;
		parameters.access_token = self.accessToken;

		for (p in parameters) {
			if (parameters.hasOwnProperty(p)) {
				params.push(p + '=' + parameters[p]);
			}
		}

		xhr = new XMLHttpRequest();
		xhr.open('GET', self.requestsURL + methodName + '?' + params.join('&'), true);
		xhr.onreadystatechange = () => {
			var responseData;
			if (xhr.readyState === 4 && xhr.status === 200) {
				responseData = JSON.parse(xhr.response);

				if (responseData.error) {
					console.error(responseData);
					return;
				}

				(typeof success === 'function') && success(responseData);
			}
		}
		xhr.send();

		return xhr;
	}

	checkAppPermissions (callback) {

		var accessToken;

		accessToken = chrome.storage.local.get(['userId', 'accessToken'], (data) => {
			if (!data.userId || !data.accessToken) {
				AppActions.changeView('login');
			} else {
				this.userId = data.userId;
				this.accessToken = data.accessToken;

				this.request('account.getAppPermissions', {
					user_id: this.userId,
					access_token: this.accessToken
				}, (r) => {
					if (r.response === AppConstants.APP_PERMISSIONS) {
						AppActions.changeView('content');
						(typeof callback === 'function') && callback();
					} else {
						AppActions.changeView('login');
					}
				});
			}
		});
	}

	getUserInfo (callback) {

		var self = this;

		self.request('users.get', {user_ids: self.userId}, (r) => {
			if (r.response && r.response[0]) {
				let userData = r.response[0];

				callback && callback({
					firstName: userData['first_name'],
					lastName: userData['last_name']
				});
			}
		});
	}

	getAudios (callback) {

		var self = this;

		self.request('audio.get', {owner_id: self.userId}, (r) => {
			let audios = r.response && r.response.length && r.response.slice(1);

			callback && callback({
				audios: audios
			});
		});
	}

	searchAudios (query, callback) {
		var currentCallTimestamp,
			timestampDifference,
			timeoutInterval;

		if (!query) {
			return;
		}

		currentCallTimestamp = +(new Date());
		timestampDifference = (currentCallTimestamp - (this.lastCallTimestamp || 0));

		if (this.timeoutId !== null || (timestampDifference < 340)) {
			clearTimeout(this.timeoutId);
			timeoutInterval = timestampDifference > 340 ? 340 : timestampDifference;
			this.timeoutId = setTimeout(() => {
				this.__searchAudiosHandler(query, callback);
				this.timeoutId = null;
			}, timeoutInterval);
		} else {
			this.__searchAudiosHandler(query, callback);
		}

	}

	getAlbums (callback) {

		var self = this;

		self.request('audio.getAlbums', {
			owner_id: self.userId
		}, (r) => {
			callback && callback(r);
		});
	}

	moveToAlbum (groupId, albumId, audioIds) {

		return;

		var requestData = {};

		!!groupId && (requestData.group_id = groupId);
		!!albumId && (requestData.album_id = albumId);
		!!audioIds && (requestData.audio_ids = audioIds);

		this.request('audio.moveToAlbum', requestData, (r) => {
			console.log(r)
		});
	}

	__searchAudiosHandler (query, callback) {

		if (this.searchAudioXhrId) {
			this.searchAudioXhrId.abort();
		}

		this.lastCallTimestamp = +(new Date());

		this.searchAudioXhrId = this.request('audio.search', {
			q: query,
			auto_complete: 1,
			count: 100
		}, (r) => {

			var searchResults = !r.error && r.response.slice(1) || [];

			callback && callback({
				searchResults: searchResults
			});
		});
	}

	authorize () {

		var self = this;

		var currentTabId = null;
		// get current tab

		chrome.tabs.getCurrent((tab) => {
			currentTabId = tab.id;
		});

		chrome.tabs.create({
			url: self.authURL,
			selected: true
		}, (tab) => {
			var createdTabId = tab.id;
			chrome.tabs.onUpdated.addListener((tabId, tabInfo) => {

				var a,
					hash,
					accessData = {},
					pairs;


				if (tabId === createdTabId && tabInfo.url != null && tabInfo.status === 'loading') {

					if (tabInfo.url.indexOf('https://oauth.vk.com/blank.html') === 0) {

						a = document.createElement('a');
						a.href = tabInfo.url;


						hash = a.hash.substring(1);

						pairs = hash.split('&');
						pairs.forEach(pair => {

							let [key, value] = pair.split('=');
							accessData[key] = value;

						});

						if (accessData['access_token']) {

							self.accessToken = accessData['access_token'];
							self.userId = accessData['user_id'];

							chrome.storage.local.set({
								accessToken: self.accessToken,
								userId: self.userId
							});

							AppActions.changeView('content');

							AppActions.processUsersData();

							chrome.tabs.update(currentTabId, {
								highlighted: true
							});

							chrome.tabs.remove(tabId, () => {});

						}

					}
				}
			});
		});
	}
}

export default new VKProvider();