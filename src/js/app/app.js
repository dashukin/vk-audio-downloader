'use strict';

import React from 'react';
import Component from '../components/component.js';
import LoadingView from '../components/loading/app-loading.js';
import LoginView from '../components/login/app-login.js';
import AppContentView from '../components/content/app-content-router.js';
import AppStore from '../stores/app-store.js';
import AppConstants from '../constants/app-constants.js';
import AppDispatcher from '../dispatchers/app-dispatcher.js';

class App extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			authState: 'loading',
			personalAudios: []
		}
		this.dispatcherIndex = null;
	}

	componentWillMount () {
		AppStore.initVK();
		AppStore.addListener(AppConstants.CHANGE_EVENT, this.processAudio);
	}

	componentDidMount () {

		var self = this;

		AppStore.addChangeListener(AppConstants.CHANGE_AUTH_STATE, self.changeView);

		AppDispatcher.register(function (payload) {
			var actionType = payload.actionType;
			switch (actionType) {
				case AppConstants.CHANGE_VIEW:
					self.changeView(payload.viewName);
					break;
			}
		});
	}

	componentWillUnmount () {
		var self = this;
		AppStore.removeChangeListener(AppConstants.CHANGE_AUTH_STATE, self.changeView);
	}

	processAudio = () => {

		var self = this,
			personalAudios = AppStore.storeData.personalAudios;

		this.setState({
			personalAudios: personalAudios
		});

	}


	changeView (viewAlias) {
		this.setState({
			authState: viewAlias
		});
	}

	render() {

		var self = this,
			state = self.state,
			view,
			appClassName = 'app ' + (state.authState);

		switch (self.state.authState) {
			case 'loading':
				view =  <LoadingView />;
				break;
			case 'content':
				view = <AppContentView personalAudios={this.state.personalAudios} />;
				break;
			case 'login':
			default:
				view =  <LoginView />;
				break;
		}
		return (
			<div className={appClassName}>
				{view}
			</div>
		);
	}
};

export default App;