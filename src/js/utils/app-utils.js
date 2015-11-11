'use strict';

class AppUtils {

	convertSecondsToReadableTime (seconds) {

		var days,
			hours,
			minutes,
			seconds,
			output;

		seconds = seconds > 0 ? parseInt(seconds, 10) : 0;
		if (!seconds || Object.prototype.toString.call(seconds).slice(8, -1) !== 'Number') return '00m 00s';

		days 	= Math.floor(seconds / (3600 * 24)) || 0;
		hours 	= Math.floor((seconds % (3600 * 24)) / 3600) || 0;
		minutes = Math.floor((seconds % (3600 * 24) % 3600) / 60) || 0;
		seconds = Math.floor(seconds % (3600 * 24) % 3600 % 60) || 0;

		minutes = minutes + '';
		minutes = minutes.length === 1 ? '0' + minutes : minutes;
		seconds = seconds + '';
		seconds = seconds.length === 1 ? '0' + seconds : seconds;

		output = (days ? days + 'd ' : '') + (hours ? hours + 'h ' : '') + (minutes + 'm ') + (seconds + 's');

		return output;
	}

}

export default new AppUtils();