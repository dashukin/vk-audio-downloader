'use strict';

import React from 'react';
import Immutable from 'immutable';
import Component from '../component.js';
import AudioItem from '../content/app-content-audio-item.js';

class AudioList extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {

	}

	componentWillUnmount () {

	}

	render () {

		var self,
			props,
			audioList,
			audioListOutput,
			playbackInfo,
			playBackInfoProperties,
			isActiveAudio;

		self = this;
		props = self.props;
		audioList = props.audioList || [];

		playbackInfo = self.props.playbackInfo;

		//TODO: remove;
		audioList = audioList.slice(0,2);

		audioListOutput = !audioList.length ? 'Loading...' : audioList.map(audioData => {
			isActiveAudio = audioData.aid === playbackInfo.audioId;

			playBackInfoProperties = isActiveAudio ? playbackInfo : null;
			playBackInfoProperties = Immutable.fromJS(playBackInfoProperties);

			return <AudioItem data={audioData} key={audioData.aid} playbackInfo={playBackInfoProperties} />
		});

		return (
			<div className="audio-list">
				{audioListOutput}
			</div>
		);
	}

}

export default AudioList;