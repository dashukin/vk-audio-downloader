import React from 'react';
import LoadingView from '../components/loading/app-loading.js';
import LoginView from '../components/login/app-login.js';
import AppContentRoutesView from '../components/content/app-content-routes.js';
import AppStore from '../stores/app-store.js';
import AppConstants from '../constants/app-constants.js';
import AppDispatcher from '../dispatchers/app-dispatcher.js';

class App extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			authState: 'loading'
		}
		this.dispatcherIndex = null;
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



	changeView (viewAlias) {
		this.setState({
			authState: viewAlias
		});
	}

	render() {

		let self = this,
			view,
			appClassName = 'app ' + (this.state.authState);

		switch (self.state.authState) {
			case 'loading':
				view =  <LoadingView />;
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
};

export default App;