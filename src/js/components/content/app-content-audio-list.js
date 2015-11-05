'use strict';

import React from 'react';
import Immutable from 'immutable';
import AudioItem from '../content/app-content-audio-item.js';
import Loading from '../loading/app-loading.js';
import _ from 'lodash';

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
			personalAudioList,
			audioListOutput,
			playbackInfo,
			playBackInfoProperties,
			isActiveAudio,
			isInPlaylist;

		self = this;
		props = self.props;
		audioList = props.audioList || [];

		// for debugging
		//audioList = audioList.slice(0, 1);

		personalAudioList = props.personalAudioList || [];

		playbackInfo = self.props.playbackInfo;

		audioListOutput = !audioList.length ? <Loading/> : audioList.map(audioData => {
			isActiveAudio = audioData.aid === playbackInfo.get('audioId');

			playBackInfoProperties = isActiveAudio ? playbackInfo : null;
			//playBackInfoProperties = Immutable.fromJS(playBackInfoProperties);
			isInPlaylist = !!_.find(personalAudioList, {aid: audioData.aid});

			return <AudioItem contentType={this.props.contentType} data={audioData} downloadProgress={props.downloadProgress} key={audioData.aid} playbackInfo={playBackInfoProperties} isInPlaylist={isInPlaylist} />
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