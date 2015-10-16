'use strict';

import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppConstants from '../../constants/app-constants.js';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import Router from 'react-router';
import {IndexRoute, Route, Link} from 'react-router';
import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory';
import createHashHistory from 'react-router/node_modules/history/lib/createHashHistory';
import Header from '../content/app-content-header.js';
import AppContentSearchView from '../content/app-content-audio-search.js';
import MyAudiosView from '../content/app-content-audio-personal-list.js';
import NotFoundView from '../notFound/app-notfound.js';
import ContentView from '../content/app-content.js';

//let history = createBrowserHistory();
let history = createHashHistory();

class AppContentRouter extends React.Component {

	constructor (props) {
		super(props);
		this.state = {};
	}

	componentWillMount () {

	}

	componentDidUpdate () {

	}

	componentDidMount () {


		// TODO: replace with "self.refs.app" when React 0.14 is ready
		// React.render(<Router history={history}>{routes}</Router>, self.refs['routes'].getDOMNode());
	}

	render () {

		let self = this,
			props = self.props,
			routes;

		routes = (
			<Route path='/'>
				<IndexRoute component={ContentView} />
				<Route path="index" component={ContentView} />
				<Route path="search" type="search" hasSearch={true} component={ContentView} />
				<Route path="my-audio" type="personal" component={ContentView} />
				<Route path="*" component={NotFoundView}/>
			</Route>
		);

		return (
			<div ref="routes">
				<Router history={history}>{routes}</Router>
			</div>
		);
	}
};

export default AppContentRouter;