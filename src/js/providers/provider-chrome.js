/**@namespace chrome.downloads.onCreated*/
/**@namespace chrome.downloads.onChanged*/


'use strict';

import AppConstants from '../constants/app-constants.js';
import AppActions from '../actions/app-actions.js';
import {Map} from 'immutable';

class ChromeProvider {

	constructor () {
		this.createListeners();
	}

	downloadProgressIntervalId = null;

	downloadItems = Map({});

	downloadStartTimes = [];

	createListeners () {

		chrome.downloads.onCreated.addListener((downloadItem) => {

			this.downloadStartTimes.push(+(new Date(downloadItem.startTime)));

			this.downloadItems = this.downloadItems.set(downloadItem.id, Map({
				id: downloadItem.id,
				url: downloadItem.url,
				totalBytes: downloadItem.totalBytes,
				bytesReceived: 0,
				percentsLoaded: 0,
				state: downloadItem.state
			}));

			this.shouldCheckDownloadProgress();
		});

		chrome.downloads.onChanged.addListener((properties) => {

			//console.warn(properties);

			if (properties.hasOwnProperty('error')) {
				switch (properties.error.current) {
					case 'USER_CANCELED':
						this.downloadItems = this.downloadItems.delete(properties.id);
						AppActions.trackDownloadProgress(this.downloadItems);
						this.shouldCheckDownloadProgress();
						break;
				}
			}

			if (properties.state && (properties.state.current === 'complete')) {

				this.downloadItems = this.downloadItems.updateIn([properties.id, 'percentsLoaded'], () => 100);
				this.downloadItems = this.downloadItems.updateIn([properties.id, 'state'], () => properties.state.current);
				AppActions.trackDownloadProgress(this.downloadItems);

				this.shouldCheckDownloadProgress();


			}
		});
	}

	shouldCheckDownloadProgress () {

		var hasItemsInProgress = this.downloadItems.filter((item) => item.get('state') === 'in_progress').size > 0;

		if (hasItemsInProgress) {
			if (this.downloadProgressIntervalId === null) {
				this.downloadProgressIntervalId = setInterval(() => {
					this.checkDownloadProgress();
				}, 200);
			}
		} else {
			clearInterval(this.downloadProgressIntervalId);
			this.downloadProgressIntervalId = null;
		}
	}

	checkDownloadProgress () {

		var earliestTime,
			percentsLoaded;

		earliestTime = +(new Date());

		if (this.downloadStartTimes.length) {
			earliestTime = Math.min.apply(null, this.downloadStartTimes);
		}

		earliestTime -= 1;

		chrome.downloads.search({
			startedAfter: earliestTime + '', // TODO: check startedAfter behavior to remove limit key
			orderBy: ['-startTime'],
			limit: 100
		}, (items) => {
			items.forEach((item) => {
				if (this.downloadItems.has(item.id)) {
					percentsLoaded = parseInt(((item.bytesReceived / item.totalBytes) * 100), 10);
					this.downloadItems = this.downloadItems.updateIn([item.id, 'bytesReceived'], () => item.bytesReceived);
					this.downloadItems = this.downloadItems.updateIn([item.id, 'percentsLoaded'], () => percentsLoaded);
					AppActions.trackDownloadProgress(this.downloadItems);
				}
			});
		});
	}

	downloadFile (options) {

		var downloadData = {
			url: options.url,
			saveAs: false
		};

		options.filename && (downloadData.filename = options.filename);

		chrome.downloads.download(downloadData);
	}

	showDownloadedFile (downloadId) {
		chrome.downloads.show(downloadId);
	}

	// TODO: move other calls here

}

export default new ChromeProvider();