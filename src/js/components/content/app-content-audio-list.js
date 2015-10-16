'use strict';

import React from 'react';
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
			audioListOutput;

		self = this;
		props = self.props;
		audioList = props.audioList || [];

		audioListOutput = '';
		audioListOutput = audioList.map(audioData => {
			return <AudioItem data={audioData} key={audioData.aid} />
		});

		return (
			<div className="audio-list">
				{audioListOutput}
			</div>
		);
	}

}

export default AudioList;