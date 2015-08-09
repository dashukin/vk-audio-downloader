'use strict';

/**
 * @namespace VK.Auth.getLoginStatus
 * @namespace VK.Auth.login
 * @namespace VK.Api
 * @namespace r.session.mid
 */

import AppDispatcher from '../dispatchers/app-dispatcher.js';
import AppActions from '../actions/app-actions.js';
import AppConstants from '../constants/app-constants.js';
import assign from 'object-assign';
import {EventEmitter} from 'events';

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
	userInfo: {
		uid: null,
		firstName: '',
		lastName: '',
		myAudiosCount: 0
	},
	personalList: [],
	searchQuery: '',
	searchResults: [],
	initVK () {
		VK.init({
			apiId: AppConstants.API_ID
		});
		console.log('VK inited.');
		console.log('Gonna run checkAuthorization on init...');
		this.checkAuthorization();
	},
	checkAuthorization () {
		console.log('Checking authorization');
		var self = this;

		VK.Auth.getLoginStatus(function (r) {
			if (r.session && r.session.mid) {
				console.log('User is authorized.');
				self.setUserId(r.session.mid);
				self.checkAppPermissions();
			}
		});
	},
	checkAppPermissions () {
		var self = this;
		console.log('Checking app permissions...');
		console.log('Required permissions: ', AppConstants.APP_PERMISSIONS);
		VK.Api.call('account.getAppPermissions', {
			user_id: self.userInfo.uid
		}, function (r) {
			if (r.response && r.response === AppConstants.APP_PERMISSIONS) {
				// show content
				console.log('should show app content');
				AppActions.changeView('content');
				self.getUserInfo();
			} else {
				// show login
				console.log('should show login view');
				AppActions.changeView('login');
			}
		});
	},
	runAuthorization () {
		console.log('Running authorization');
		VK.Auth.login(function (r) {
			console.log(r);
		}, AppConstants.APP_PERMISSIONS);
	},
	getUserInfo () {

		let self = this;

		VK.Api.call('users.get', {user_ids: this.userInfo.uid}, function (r) {
			if (r.response && r.response[0]) {
				let uData = r.response[0];
				self.userInfo.firstName = uData['first_name'];
				self.userInfo.lastName  = uData['last_name'];
				self.emitChange();
				//AppActions.processUserInfo(self.userInfo);
			}
		});
	},
	getMyAudios () {
		console.log('Getting personal list...');
		var self = this;

		if (!self.personalList.length) {
			VK.Api.call('audio.get', {
				owner_id: self.userInfo.uid
			}, (r) => {
				console.log('Audios were successfully loaded.')
				let userAudios = r.response.slice(1);
				self.personalList = userAudios;
				self.userInfo.myAudiosCount = userAudios.length;
				self.emitChange();
			});
		} else {
			self.emitChange();
		}
	},
	searchAudio: (() => {

		var timeoutId = null,
			lastCallTimestamp = null;

		return function (query) {

			var self = this,
				currentCallTimestamp,
				timestampDifference,
				timeoutInterval;

			if (!query) {
				this.searchQuery = '';
				return;
			}

			currentCallTimestamp = +(new Date());
			timestampDifference = (currentCallTimestamp - (lastCallTimestamp || 0));

			if (timeoutId !== null || (timestampDifference < 350)) {
				clearTimeout(timeoutId);
				timeoutInterval = timestampDifference > 350 ? 350 : timestampDifference;
				timeoutId = setTimeout(() => {
					searchHandler();
					timeoutId = null;
				}, timeoutInterval);
			} else {
				searchHandler();
			}

			function searchHandler () {
				lastCallTimestamp = +(new Date());
				VK.Api.call('audio.search', {
					q: query,
					auto_complete: 1
				}, (r) => {
					console.log(r);
					var searchResults = !r.error && r.response.slice(1) || [];
					self.searchResults = searchResults;
					self.searchQuery = query;
					AppActions.processSearchResults(searchResults);
				});
			}
		}
	})(),
	setUserId (uid) {
		this.userInfo.uid = uid;
	},
	getSearchQuery () {
		return this.searchQuery || '';
	},
	getSearchResults () {
		return this.searchResults || [];
	},
	dispatcherIndex: AppDispatcher.register((payload) => {

		switch (payload.actionType) {
			case AppConstants.SEARCH_AUDIO:
				AppStore.searchAudio(payload.query);
				break;
		}
		return true;
	})
});

export default AppStore;