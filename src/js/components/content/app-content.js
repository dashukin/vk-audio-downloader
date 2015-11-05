'use strict';

import React from 'react';
import SearchForm from '../content/app-content-search-form';
import AudioList from '../content/app-content-audio-list.js';
import Header from '../content/app-content-header.js';
import AppStore from '../../stores/app-store.js';
import VKProvider from '../../providers/provider-vk.js';
import AppConstants from '../../constants/app-constants.js';
import {Map, List, Record} from 'immutable';
import _ from 'lodash';

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

		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.storeChangesHandler);
	}

	componentDiDMount () {
		this.storeChangesHandler();
	}

	componentWillReceiveProps (nextProps) {

		if (this.props.contentType !== nextProps.route.contentType) {
			this.storeChangesHandler(nextProps.route.contentType);
		}

	}

	componentDidUpdate () {

	}

	storeChangesHandler = (routeType) => {

		var listType,
			audioList,
			personalAudioList,
			storeData;

		listType = routeType || this.props.route.contentType;

		audioList = AppStore.getAudioList(listType) || [];
		personalAudioList = AppStore.getAudioList('personal') || [];

		storeData = AppStore.storeData || {};

		this.setState({
			audioList: audioList,
			personalAudioList: personalAudioList,
			userInfo: storeData.userInfo,
			playbackInfo: storeData.playbackInfo,
			searchQuery: storeData.searchQuery,
			downloadProgress: storeData.downloadProgress
		});

	}

	render () {

		var state,
			routeProps,
			hasSearch,
			audioList,
			personalAudioList,
			userInfo,
			playbackInfo,
			downloadProgress,
			searchQuery;

		state = this.state;

		routeProps = this.props.route;
		hasSearch = routeProps.hasSearch === true;
		audioList = state.audioList;
		personalAudioList = state.personalAudioList;
		userInfo = state.userInfo;

		playbackInfo = state.playbackInfo;
		downloadProgress = state.downloadProgress;

		searchQuery = state.searchQuery || '';

		// {React.cloneElement(this.props.children, {})}

		return (
			<div className="app-content">
				<Header userInfo={userInfo} />

				<div className="container app-content-container">

					{hasSearch && <SearchForm searchQuery={searchQuery}/>}

					<AudioList contentType={this.props.route.contentType} audioList={audioList} personalAudioList={personalAudioList} playbackInfo={playbackInfo} downloadProgress={downloadProgress} />

				</div>
			</div>
		);
	}

}

export default ContentView;