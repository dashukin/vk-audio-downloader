'use strict';

import React from 'react';
import Loading from '../loading/app-loading.js';
import {Card, CardHeader, CardTitle, CardMedia, CardText, CardActions, FlatButton} from 'material-ui';
import AppUtils from '../../utils/app-utils.js';
import AppActions from '../../actions/app-actions.js';

class AudioItemDescription extends React.Component {

	componentDidMount () {
		this.loadLyrics();
	}

	shouldComponentUpdate (nextProps) {
		let props = this.props,
			updateAudioData = props.audioData !== nextProps.audioData,
			updateAudioLyrics = props.audioLyrics !== nextProps.audioLyrics;
		return (updateAudioData || updateAudioLyrics);
	}

	componentDidUpdate () {
		this.loadLyrics();
	}

	loadLyrics () {
		let lyricsId = this.props.audioData.get('lyrics_id');
		lyricsId && AppActions.loadLyrics(lyricsId);
	}

	render () {

		let audioData = this.props.audioData,
			audioLyrics = this.props.audioLyrics,
			defaultText = audioData.get('defaultText'),
			title = audioData.get('title'),
			artist = audioData.get('artist'),
			duration = audioData.get('duration'),
			lyricsId = audioData.get('lyrics_id'),
			lyrics = audioLyrics.has(+lyricsId) ? audioLyrics.get(+lyricsId) : null,
			readableDuration = duration ? AppUtils.convertSecondsToReadableTime(duration) : '',
			lyricsOutput = '';

		if (lyricsId) {
			lyricsOutput = lyrics ? lyrics : <Loading />;
		}

		return (
			<Card style={{boxShadow: 'none', marginTop: '15px'}}>
				{defaultText &&
					<CardTitle
						subtitle={defaultText}
					/>
				}
				{(title || artist) &&
					<CardTitle
						title={title}
						subtitle={artist}
					/>
				}

				<CardText>
					{duration &&
						<p>{readableDuration}</p>
					}
					<div style={{whiteSpace: 'pre'}}>{lyricsOutput}</div>
				</CardText>
			</Card>
		);
	}

}

export default AudioItemDescription;