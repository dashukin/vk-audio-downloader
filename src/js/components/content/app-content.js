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
import PersonalView from '../content/app-content-personal.js';
import SearchView from '../content/app-content-search.js';

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
	//	React.render(<Router history={history}>{routes}</Router>, self.refs['routes'].getDOMNode());
	}

	render () {

		let self = this,
			props = self.props,
			routes;

		routes = (
			<Route path='/' component={Header} personalAudios={props.personalAudios} >
				<IndexRoute component={PersonalView} />
				<Route path="index" component={PersonalView} />
				<Route path="search" component={SearchView} />
				<Route path="my-audio" component={PersonalView} />
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