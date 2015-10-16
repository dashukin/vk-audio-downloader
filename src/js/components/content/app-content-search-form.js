'use strict';
import React from 'react';

class SearchForm extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {

	}

	componentWillUnmount () {

	}

	searchAudio () {
		console.log('Searching audio');
	}

	render () {
		return (
			<div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<input ref="searchInput" type="text" className="form-control" placeholder="Type here..." defaultValue="" onKeyUp={this.searchAudio}/>
				</div>
			</div>
		);
	}

}

export default SearchForm;