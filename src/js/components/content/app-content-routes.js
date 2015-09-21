'use strict';

import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppConstants from '../../constants/app-constants.js';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import ReactRouter from 'react-router';
import {DefaultRoute, Link, Route, RouteHandler, NotFoundRoute, Redirect} from 'react-router';
import NotFoundView from '../notFound/app-notfound.js';
import Header from '../content/app-content-header.js';
import AppContentSearchView from '../content/app-content-audio-search.js';
import MyAudiosView from '../content/app-content-audio-personal-list.js';
import NavigationView from '../content/app-content-navigation.js';



class AppContentRouter extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			Handler: null,
			navigationIsReady: false
		};
	}

	componentWillMount () {

	}

	componentDidMount () {
		let self = this,
			routes = (
				<Route name='content' path='/' handler={Header}>
					<DefaultRoute handler={MyAudiosView} />
					<Route name="search" path="/search" handler={AppContentSearchView} />
					<Route name="my-audio" path="/my-audio" handler={MyAudiosView} />
					<NotFoundRoute handler={NotFoundView} />
				</Route>
			);
		ReactRouter.run(routes, ReactRouter.HashLocation, (Handler, State) => {
			self.setState({
				Handler: Handler
			})
		});
	}

	render () {
		return (
			<div>
				{this.state.Handler ? <this.state.Handler/> : ''}
			</div>
		);
	}
};

export default AppContentRouter;