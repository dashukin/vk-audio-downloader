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
		this.state = {
			firstName: '',
			lastName: '',
			myAudiosCount: 0
		};
	}

	componentWillMount () {
		var self = this;
		AppStore.addChangeListener(AppConstants.CHANGE_EVENT, self.showUserInfo);
	}

	componentDidMount () {

	}

	componentWillUnmount () {
		var self = this;
		AppStore.removeListener(AppConstants.CHANGE_EVENT, self.showUserInfo);
	}

	showUserInfo = () => {
		var self = this,
		userInfo = AppStore.storeData;

		self.setState({
			firstName: userInfo.firstName,
			lastName: userInfo.lastName,
			myAudiosCount: userInfo.personalAudiosCount
		});
	}

	render () {

		console.error(this.props);

		let userName = this.state.firstName ? ', ' + this.state.firstName + (this.state.lastName ? ' ' + this.state.lastName + '!' : '!') : '!';
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
											{!!this.state.personalAudiosCount
												? <span className="my-audios-count"> ({this.state.personalAudiosCount})</span>
												: ''
											}
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				{React.cloneElement(this.props.children, {personal: 1 })}
			</div>
		);
	}
}

export default Header;