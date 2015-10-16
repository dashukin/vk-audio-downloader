'use strict';

import React from 'react';
import SearchForm from '../content/app-content-search-form';
import AudioList from '../content/app-content-audio-list.js';
import Header from '../content/app-content-header.js';
import AppStore from '../../stores/app-store.js';
import VKProvider from '../../providers/provider-vk.js';
import AppConstants from '../../constants/app-constants.js';

class SearchView extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			audioList: []
		}
	}

	componentWillMount () {
		var self = this;
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.storeChangesHandler);
	}

	componentDiDMount () {
		VKProvider.getAudios();
	}

	storeChangesHandler = () => {

		var self = this,
			listType,
			audioList;

		listType = self.props.route.type;

		audioList = AppStore.getAudioList(listType) || [];

		self.setState({
			audioList: audioList
		});
	}

	render () {

		var self,
			routeProps,
			hasSearch,
			audioList;

		self = this;
		routeProps = self.props.route;
		hasSearch = routeProps.hasSearch === true;
		audioList = self.state.audioList;

		// {React.cloneElement(this.props.children, {})}

		return (
			<div>
				<Header />

				<div className="container">

					{hasSearch && <SearchForm/>}

					<AudioList audioList={audioList}/>

				</div>
			</div>
		);
	}

}

export default SearchView;