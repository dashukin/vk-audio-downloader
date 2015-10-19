'use strict';

import React from 'react';
import Component from '../component.js';
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
		this.state = {
			personalAudiosCount: 0
		}
	}

	componentWillMount () {
		var self = this;
	}

	componentDidMount () {

	}

	shouldComponentUpdate (nextProps, nextState) {
		var self = this,
			shouldUpdate = self.props.userInfo !== nextProps.userInfo;
		return shouldUpdate;
	}

	componentWillUnmount () {

	}

	showUserInfo = () => {

	}

	render () {

		var self = this,
			props = self.props,
			userInfo = props.userInfo.toObject();

		let userName = userInfo.firstName ? ', ' + userInfo.firstName + (userInfo.lastName ? ' ' + userInfo.lastName + '!' : '!') : '!';

		return (
			<div>
				<div className="navbar navbar-default">
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
										<Link to="/my-audio">My audio
											{!!userInfo.personalAudiosCount
												? <span className="my-audios-count"> ({userInfo.personalAudiosCount})</span>
												: ''
											}
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;