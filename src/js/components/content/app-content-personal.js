'use strict';

import React from 'react';
import AudioList from '../content/app-content-audio-list.js';

class PersonalView extends React.Component {

	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div className="container">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Personal view</div>
				</div>
				<AudioList />
			</div>
		);
	}

}

export default PersonalView;