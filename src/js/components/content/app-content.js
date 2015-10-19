'use strict';

import React from 'react';
import Component from '../component.js';
import SearchForm from '../content/app-content-search-form';
import AudioList from '../content/app-content-audio-list.js';
import Header from '../content/app-content-header.js';
import AppStore from '../../stores/app-store.js';
import VKProvider from '../../providers/provider-vk.js';
import AppConstants from '../../constants/app-constants.js';
import {Map, List} from 'immutable';

class ContentView extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			audioList: [],
			userInfo: Map({
				authorized: false,
				firstName: '',
				lastName: '',
				personalAudiosCount: 0
			}),
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

		this.storeChangesHandler();
	}

	componentWillReceiveProps (nextPprops) {

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
			storeData,
			storeUserInfo

		listType = self.type;

		audioList = AppStore.getAudioList(listType) || [];

		storeData = AppStore.storeData || {};
		storeUserInfo = storeData.userInfo;

		self.setState({
			audioList: audioList,
			//userInfo: storeData.userInfo,
			playbackInfo: storeData.playbackInfo
		});

		this.setState(({userInfo}) => ({
			userInfo: userInfo.update('firstName', () => storeUserInfo.firstName)
		}));

		this.setState(({userInfo}) => ({
			userInfo: userInfo.update('personalAudiosCount', () => storeUserInfo.personalAudiosCount)
		}));
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

export default ContentView;