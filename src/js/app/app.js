'use strict';

import React from 'react';
import LoadingView from '../components/loading/app-loading.js';
import LoginView from '../components/login/app-login.jsx';
import AppContentRoutesView from '../components/content/app-content-routes.jsx';
import AppStore from '../stores/app-store.js';
import AppConstants from '../constants/app-constants.js';
import AppDispatcher from '../dispatchers/app-dispatcher.js';

AppStore.initVK();

let App = React.createClass({
	getInitialState () {
		return {
			viewAlias: 'loading'
		}
	},
	componentWillMount () {
		var self = this;
		AppDispatcher.register(function (payload) {
			var actionType = payload.actionType;
			switch (actionType) {
				case AppConstants.CHANGE_VIEW:
					self.setView(payload.viewName);
					break;
			}
		});
	},
	componentWillUnmount () {

	},
	dispatcherIndex: null,
	setView (viewAlias) {
		this.setState({
			viewAlias: viewAlias
		});
	},
	render() {

		let view,
			appClassName = 'app ' + (this.state.viewAlias);

		switch (this.state.viewAlias) {
			case 'loading':
				view =  <LoadingView onClick={this.setView.bind(this, 'login')} />;
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
