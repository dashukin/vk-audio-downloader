'use strict';

import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import ReactRouter from 'react-router';
import {Link, Router} from 'react-router';
import MyAudiosView from '../content/app-content-audio-personal-list.js';
import AppContentSearchView from '../content/app-content-audio-search.js';
import NotFoundView from '../notFound/app-notfound.js';

class Header extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {

	}

	componentDidMount () {

	}

	shouldComponentUpdate (nextProps, nextState) {
		return this.props.userInfo !== nextProps.userInfo;
	}

	componentWillUnmount () {

	}

	render () {

		var userInfo = this.props.userInfo,
			firstName = userInfo.get('firstName'),
			lastName = userInfo.get('lastName'),
			personalAudiosCount = userInfo.get('personalAudiosCount'),
			userName;


		userName = firstName ? ', ' + firstName + (lastName ? ' ' + lastName + '!' : '!') : '!';

		return (
			<div className="navbar navbar-default app-content-header-navbar">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<ul className="nav navbar-nav list-unstyled">
								<li>
									<a>Welcome{userName}</a>
								</li>
								<li>
									<Link to="/search">Search</Link>
								</li>
								<li>
									<Link to="/my-audio">My audios
										{!!personalAudiosCount
											? <span className="my-audios-count"> ({personalAudiosCount})</span>
											: ''
										}
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;