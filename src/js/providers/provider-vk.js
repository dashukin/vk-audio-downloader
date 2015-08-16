/**
 *
 */


'use strict';

import AppConstants from '../constants/app-constants.js';
import AppActions from '../actions/app-actions.js';

var VK = window.VK;

class VKProvider {
	/** @namespace VK.Auth */
	/** @namespace VK.Auth.login */
	/** @namespace VK.Api.getLoginStatus */

	constructor () {
		this.timeoutId = null;
		this.lastCallTimestamp = null;
	}

	init () {
		VK.init({
			apiId: AppConstants.API_ID
		});
	}

	checkAuthorization (callback) {
		VK.Auth.getLoginStatus(function (r) {
			if (r.session && r.session.mid) {
				console.log('User is authorized.');
				callback({
					userId: r.session.mid
				});
			}
		});
	}

	checkAppPermissions (userId, callback) {
		console.log('Checking app permissions...');
		console.log('Required permissions: ', AppConstants.APP_PERMISSIONS);
		VK.Api.call('account.getAppPermissions', {
			user_id: userId
		}, function (r) {
			if (r.response && r.response === AppConstants.APP_PERMISSIONS) {
				// show content
				console.log('should show app content');
				AppActions.changeView('content');
				callback && callback();
			} else {
				// show login
				console.log('should show login view');
				AppActions.changeView('login');
			}
		});
	}

	getUserInfo (userId, callback) {
		VK.Api.call('users.get', {user_ids: userId}, function (r) {
			if (r.response && r.response[0]) {
				let userData = r.response[0];

				callback && callback({
					firstName: userData['first_name'],
					lastName: userData['last_name']
				});
			}
		});
	}

	getAudios (userId, callback) {
		VK.Api.call('audio.get', {
			owner_id: userId
		}, (r) => {
			console.log('Audios were successfully loaded.')
			let audios = r.response.slice(1);

			callback && callback({
				audios: audios
			});
		});
	}

	searchAudios (query, callback) {
		var self = this,
			currentCallTimestamp,
			timestampDifference,
			timeoutInterval;

		if (!query) {
			this.storeDatasearchQuery = ''; // TODO: ???
			return;
		}

		currentCallTimestamp = +(new Date());
		timestampDifference = (currentCallTimestamp - (self.lastCallTimestamp || 0));

		if (self.timeoutId !== null || (timestampDifference < 350)) {
			clearTimeout(self.timeoutId);
			timeoutInterval = timestampDifference > 350 ? 350 : timestampDifference;
			self.timeoutId = setTimeout(() => {
				self.__searchAudiosHandler(query, callback);
				self.timeoutId = null;
			}, timeoutInterval);
		} else {
			self.__searchAudiosHandler(query, callback);
		}

	}

	__searchAudiosHandler (query, callback) {

		var self = this;

		self.lastCallTimestamp = +(new Date());
		VK.Api.call('audio.search', {
			q: query,
			auto_complete: 1
		}, (r) => {
			console.log(r);
			var searchResults = !r.error && r.response.slice(1) || [];

			callback && callback({
				searchResults: searchResults
			});

			//AppActions.processSearchResults(searchResults);
		});
	}

	authorize () {
		VK.Auth.login(function (r) {
			console.log(r);
		}, AppConstants.APP_PERMISSIONS);
	}
}

export default new VKProvider();