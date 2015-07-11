/**
 * @namespace audioData.artist
 */

import React from 'react';

class AudioItem extends React.Component {
	render () {
		let audioData = this.props.data;
		return (
			<div>
				<div className="list-group-item audio-item">
					<div className="row-action-primary">
						<a className="audio-item-play" href="#">
							<span className="mdi-av-play-circle-outline"></span>
						</a>
					</div>
					<div className="row-content">
						<div className="least-content">{audioData.duration}</div>
						<h4 className="list-group-item-heading audio-item-title">{audioData.title}</h4>
						<div className="list-group-item-text">{audioData.artist}</div>
						<audio controls preload="none">
							<source src={audioData.url} type="audio/mpeg" />
						</audio>
						<a className="audio-download" target="_blank" download="download" href={audioData.url}>
							<i className="mdi-file-file-download"></i>
						</a>
					</div>
				</div>
				<div className="list-group-separator"></div>
			</div>
		);
	}
};

export default AudioItem;