'use strict';

import React from 'react';
import Immutable from 'immutable';
import AudioItem from '../content/app-content-audio-item.js';
import Loading from '../loading/app-loading.js';

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

		audioListOutput = !audioList.length ? <Loading/> : audioList.map(audioData => {
			isActiveAudio = audioData.aid === playbackInfo.audioId;

			playBackInfoProperties = isActiveAudio ? playbackInfo : null;
			playBackInfoProperties = Immutable.fromJS(playBackInfoProperties);

			return <AudioItem data={audioData} downloadProgress={props.downloadProgress} key={audioData.aid} playbackInfo={playBackInfoProperties} />
		});

		return (
			<div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="audio-list">
						{audioListOutput}
					</div>
				</div>
			</div>
		);
	}

}

export default AudioList;