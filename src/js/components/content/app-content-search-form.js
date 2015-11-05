'use strict';
import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppActions from '../../actions/app-actions.js';

class SearchForm extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {

	}

	shouldComponentUpdate (nextProps) {
		return this.props.searchQuery !== nextProps.searchQuery;
	}

	componentWillUnmount () {

	}

	searchAudio (e) {
		var searchValue = e.target.value;
		AppActions.searchAudios(searchValue);
	}

	render () {
		return (
			<div className="row app-content-search-form-row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<input ref="searchInput" type="text" className="form-control" placeholder="Type here..." defaultValue={this.props.searchQuery} onChange={this.searchAudio}/>
				</div>
			</div>
		);
	}

}

export default SearchForm;