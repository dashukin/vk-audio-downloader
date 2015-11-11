'use strict';

import React from 'react';
import SearchForm from '../content/app-content-search-form';
import AudioList from '../content/app-content-audio-list.js';
import AudioItemDescription from '../content/app-content-audio-item-description.js';
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
		this.storeChangesHandler();
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, this.storeChangesHandler);
	}

	componentDiDMount () {

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

		audioList = AppStore.getAudioList(listType, true) || [];
		personalAudioList = AppStore.getAudioList('personal') || [];

		storeData = AppStore.storeData || {};

		this.setState({
			audioList: audioList,
			personalAudioList: personalAudioList,
			userInfo: storeData.userInfo,
			playbackInfo: storeData.playbackInfo,
			searchQuery: storeData.searchQuery,
			downloadProgress: storeData.downloadProgress,
			selectedAudioId: storeData.selectedAudioId,
			audioLyrics: storeData.audioLyrics
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
			searchQuery,
			selectedAudioData;

		state = this.state;

		routeProps = this.props.route;
		hasSearch = routeProps.hasSearch === true;
		audioList = state.audioList;
		personalAudioList = state.personalAudioList;
		userInfo = state.userInfo;

		playbackInfo = state.playbackInfo;
		downloadProgress = state.downloadProgress;

		searchQuery = state.searchQuery || '';

		selectedAudioData = Map(state.selectedAudioId &&  _.find(audioList, {aid: state.selectedAudioId}) || {defaultText: 'Select audio to see it\'s description'});

		return (
			<div className="app-content-wrapper">

				<Header userInfo={userInfo} history={this.props.history} />

				<div className="app-content-holder">

					{hasSearch && <SearchForm searchQuery={searchQuery}/>}

					<div className="row">

						<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 app-content-center">

							<AudioList contentType={this.props.route.contentType} audioList={audioList} personalAudioList={personalAudioList} playbackInfo={playbackInfo} downloadProgress={downloadProgress} />

						</div>

						<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 app-content-sidebar-right">

							{selectedAudioData.size
								? <AudioItemDescription audioData={selectedAudioData} audioLyrics={state.audioLyrics} />
								: <AudioItemDescription audioData={selectedAudioData} />
							}

						</div>

					</div>

				</div>

			</div>
		);
	}

}

export default ContentView;