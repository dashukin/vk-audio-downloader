'use strict';

;(function () {
	document.addEventListener('DOMContentLoaded', function () {

		var appUrl, appLink;

		appUrl = chrome.extension.getURL('index.html');
		appLink = document.getElementById('popup-app-link');
		appLink && appLink.setAttribute('href', appUrl);

	}, false);
}());
