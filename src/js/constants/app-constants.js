'use strict';

let Constants = {
	API_ID: 4965536,
	APP_PERMISSIONS: ((permissions) => {
		var p, mask = 0;
		for (p in permissions) {
			if (permissions.hasOwnProperty(p)) {
				mask += permissions[p];
			}
		}
		return mask;
	})({
		audio: 8
	}),
	CHANGE_EVENT: 			'CHANGE_EVENT',
	CHANGE_VIEW: 			'CHANGE_VIEW',
	PROCESS_PERSONAL_LIST: 	'PROCESS_PERSONAL_LIST',
	SEARCH_AUDIO: 			'SEARCH_AUDIO',
	PROCESS_SEARCH_RESULTS:	'PROCESS_SEARCH_RESULTS',
	PROCESS_ROUTES_HANDLER:	'PROCESS_ROUTES_HANDLER',
	USER_INFO: 				'USER_INFO',
	LOG_IN: 				'LOG_IN',
	LOGED_IN: 				'LOGED_IN',
	LOG_OUT: 				'LOG_OUT',
	LOGED_OUT: 				'LOGED_OUT',
	MOVE_TO_ALBUM:			'MOVE_TO_ALBUM',
	CURRENT_AUDIO_CHANGED:	'CURRENT_AUDIO_CHANGED',
	CHANGE_CURRENT_PLAYLIST:'CHANGE_CURRENT_PLAYLIST',
	RESET_AUDIO_STATE:		'RESET_AUDIO_STATE'
};


export default Constants;