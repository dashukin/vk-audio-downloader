'use strict';

import React from 'react';
import SearchForm from '../content/app-content-search-form';
import AudioList from '../content/app-content-audio-list.js';

class SearchView extends React.Component {

	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div className="container">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Search view</div>
				</div>
				<SearchForm />
				<AudioList />
			</div>
		);
	}

}

export default SearchView;