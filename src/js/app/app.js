'use strict';

import React from 'react';
import LoadingView from '../components/loading/app-loading.js';
import LoginView from '../components/login/app-login.js';
import AppContentRoutesView from '../components/content/app-content-routes.js';
import AppStore from '../stores/app-store.js';
import AppConstants from '../constants/app-constants.js';
import AppDispatcher from '../dispatchers/app-dispatcher.js';

AppStore.initVK();

let App = React.createClass({
	getInitialState () {
		return {
			authState: 'loading'
		}
	},
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
	},
	componentWillUnmount () {
		AppStore.removeChangeListener(AppConstants.CHANGE_AUTH_STATE, self.changeView);
	},
	dispatcherIndex: null,
	changeView (viewAlias) {
		this.setState({
			authState: viewAlias
		});
	},
	render() {

		let view,
			appClassName = 'app ' + (this.state.authState);

		switch (this.state.authState) {
			case 'loading':
				view =  <LoadingView onClick={this.changeView.bind(this, 'login')} />;
				break;
			break;
			case 'content':
				view = <AppContentRoutesView />;
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
});

React.render(<App/>, document.getElementById('app-wrapper'));
