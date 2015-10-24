'use strict';

import React from 'react';
import SearchForm from '../content/app-content-search-form';
import AudioList from '../content/app-content-audio-list.js';
import Header from '../content/app-content-header.js';
import AppStore from '../../stores/app-store.js';
import VKProvider from '../../providers/provider-vk.js';
import AppConstants from '../../constants/app-constants.js';
import {Map, List, Record} from 'immutable';

class ContentView extends React.Component {

	constructor (props) {
		super(props);
	}

	state = {
		audioList: [],
		userInfo: AppStore.storeData.userInfo,
		searchQuery: '',
		playbackInfo: null,
		contentType: null
	}

	componentWillMount () {

		var self = this;

		//self.setState({
		//	contentType: self.props.route.type
		//});

		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.storeChangesHandler);
	}

	componentDiDMount () {
		this.storeChangesHandler();
	}

	componentWillReceiveProps (nextProps) {

		if (this.props.contentType !== nextProps.route.type) {
			this.storeChangesHandler(nextProps.route.type);
		}

	}

	componentDidUpdate () {

	}

	storeChangesHandler = (routeType) => {

		var listType,
			audioList,
			storeData;

		listType = routeType || this.props.route.type;

		audioList = AppStore.getAudioList(listType) || [];

		storeData = AppStore.storeData || {};

		this.setState({
			audioList: audioList,
			userInfo: storeData.userInfo,
			playbackInfo: storeData.playbackInfo,
			searchQuery: storeData.searchQuery
		});

	}

	render () {

		var state,
			routeProps,
			hasSearch,
			audioList,
			userInfo,
			playbackInfo,
			searchQuery;

		state = this.state;

		routeProps = this.props.route;
		hasSearch = routeProps.hasSearch === true;
		audioList = state.audioList;
		userInfo = state.userInfo;

		playbackInfo = state.playbackInfo;

		searchQuery = state.searchQuery || '';

		// {React.cloneElement(this.props.children, {})}

		return (
			<div className="app-content">
				<Header userInfo={userInfo} />

				<div className="container app-content-container">

					{hasSearch && <SearchForm searchQuery={searchQuery}/>}

					<AudioList audioList={audioList} playbackInfo={playbackInfo} />

				</div>
			</div>
		);
	}

}

export default ContentView;