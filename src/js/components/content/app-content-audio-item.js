/**
 * @namespace audioData.artist
 */
'use strict';

import React from 'react';
import Download from '../../lib/download.js';
import AudioPlayer from './app-content-audio-player.js';

class AudioItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {audioPlayeInited: false};
	}

	render () {
		var audioData,
			duration;

		audioData = this.props.data;
		duration = audioData.duration;

		return (
			<div className="audio-item clearfix">

				<div className="audio-item-audioplayer">
					<AudioPlayer audioId={audioData.aid} src={audioData.url} artist={audioData.artist} title={audioData.title} duration={duration}/>
				</div>

				<ul className="audio-item-actions clearfix">
					<li>
						<a className="audio-download" target="_blank" download href={audioData.url}>
							<i className="mdi-file-file-download"></i>
						</a>
					</li>
					<li>
						<a className="" href="#" title="Add to my audios">
							<i className="mdi-av-my-library-add"></i>
						</a>
					</li>
				</ul>
			</div>
		);
	}

	prepareTrackName (e) {

		e.preventDefault();

		var audioData,
			title,
			artist,
			resultName;

		audioData = this.props.data;
		artist = audioData.artist || '';
		title = audioData.title || '';
		resultName = (artist + '_' + title).replace(/[\s]+/g, '_');

	}

};

export default AudioItem;