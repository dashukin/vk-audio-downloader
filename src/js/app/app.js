'use strict';

import React from 'react';
import LoadingView from '../components/loading/app-loading.js';
import LoginView from '../components/login/app-login.js';
import AppContentView from '../components/content/app-content-router.js';
import AppStore from '../stores/app-store.js';
import AppConstants from '../constants/app-constants.js';
import AppDispatcher from '../dispatchers/app-dispatcher.js';
import NotificationSystem from 'react-notification-system';
import ThemeManager from 'material-ui/lib/styles/theme-manager.js';
import AppTheme from '../theme/app-theme.js';


class App extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			authState: 'loading'
		}
	}

	getChildContext () {
		return {
			muiTheme: ThemeManager.getMuiTheme(AppTheme)
		}
	}

	componentWillMount () {
		AppStore.initVK();
	}

	componentDidMount () {

		var self = this;

		AppStore.addChangeListener(AppConstants.CHANGE_AUTH_STATE, self.changeView);

		AppDispatcher.register((payload) => {
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

	changeView = (viewAlias) => {
		this.setState({
			authState: viewAlias
		});
	}

	render() {

		var self = this,
			state = self.state,
			view,
			appClassName = ('app ' + (state.authState || 'login'));

		switch (self.state.authState) {
			case 'loading':
				view =  <LoadingView />;
				break;
			case 'content':
				view = <AppContentView />;
				break;
			case 'login':
			default:
				view =  <LoginView />;
				break;
		}
		return (
			<div className={'app-view-holder ' + appClassName}>
				{view}
			</div>
		);
	}
};

App.childContextTypes = {
	muiTheme: React.PropTypes.object
};

export default App;