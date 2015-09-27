'use strict';

chrome.browserAction.onClicked.addListener(function(tab) {
  	var appUrl

  	appUrl = chrome.extension.getURL('index.html');
	chrome.tabs.create({
		url: appUrl,
		selected: true
	}, function (tab) {

	});
});
