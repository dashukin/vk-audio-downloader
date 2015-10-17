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
			audioList: [],
			userInfo: {},
			playbackInfo: {}
		};
		this.type = null;
	}

	componentWillMount () {
		var self = this;

		self.type = self.props.route.type;

		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.storeChangesHandler);
	}

	componentDiDMount () {
		//this.getAppropriateAudioListAudioList(this.props);
		this.storeChangesHandler();
	}

	shouldComponentUpdate () {
		// TODO
		return true;
	}

	componentWillReceiveProps (nextPprops) {
		//this.getAppropriateAudioListAudioList(nextPprops);

		this.type = nextPprops.route.type;

		this.storeChangesHandler();
	}

	componentDidUpdate () {

	}

	getAppropriateAudioListAudioList (props) {

	}

	storeChangesHandler = () => {

		var self = this,
			listType,
			audioList,
			storeData;

		listType = self.type;

		audioList = AppStore.getAudioList(listType) || [];

		storeData = AppStore.storeData || {};

		self.setState({
			audioList: audioList,
			userInfo: storeData.userInfo,
			playbackInfo: storeData.playbackInfo
		});
	}

	render () {

		var self,
			routeProps,
			hasSearch,
			audioList,
			userInfo,
			playbackInfo;

		self = this;
		routeProps = self.props.route;
		hasSearch = routeProps.hasSearch === true;
		audioList = self.state.audioList;
		userInfo = self.state.userInfo;

		playbackInfo = self.state.playbackInfo;

		// {React.cloneElement(this.props.children, {})}

		return (
			<div>
				<Header userInfo={userInfo} />

				<div className="container">

					{hasSearch && <SearchForm/>}

					<AudioList audioList={audioList} playbackInfo={playbackInfo} />

				</div>
			</div>
		);
	}

}

export default SearchView;