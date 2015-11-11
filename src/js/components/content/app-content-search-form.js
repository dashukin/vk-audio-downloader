'use strict';
import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppActions from '../../actions/app-actions.js';
import {TextField} from 'material-ui';

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
			<div className="app-content-search-holder">
				<TextField
					hintText="type here..."
					floatingLabelText="search tracks..."
					defaultValue={this.props.searchQuery}
					onChange={this.searchAudio}
					style={{
							width: '100%'
						}}
				/>
			</div>
		);
	}

}

export default SearchForm;