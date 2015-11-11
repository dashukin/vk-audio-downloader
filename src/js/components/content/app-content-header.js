'use strict';

import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';
import MyAudiosView from '../content/app-content-audio-personal-list.js';
import AppContentSearchView from '../content/app-content-audio-search.js';
import {Router, Link} from 'react-router';
import NotFoundView from '../notFound/app-notfound.js';
import {AppBar, FlatButton, LeftNav, Menu, MenuItem, List, ListItem} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';


injectTapEventPlugin();

class Header extends React.Component {

	componentDidMount () {
		//this.refs.leftNav.close();
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


		userName = firstName ? ', ' + firstName/* + (lastName ? ' ' + lastName + '!' : '!')*/ : '!';

		return (
			<div className="">
				<AppBar
					title={"Welcome"+userName}
					showMenuIconButton={true}
					iconElementRight={
						<FlatButton
							label="Exit"
							onClick={this.exit}
						/>
					}
					onClick={this.toggleLeftNav}
				/>
				<LeftNav
					ref="leftNav"
					docked={false}
					isInitiallyOpen={false}
					menuItems={[
						{route: '/search', text: 'search'},
						{route: '/my-audio', text: 'my audios'}

					]}
					onChange={this.handleLeftNavItemClick}
				>
				</LeftNav>

				<div className="navbar navbar-default app-content-header-navbar" style={{display: 'none'}}>
					<div className="container">
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<ul className="nav navbar-nav navbar-left list-unstyled">
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
								<ul className="nav navbar-nav navbar-right">
									<li>
										<a href="#" onClick={this.exit}>Exit</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}

	handleLeftNavItemClick = (event, selectedIndex, menuItem) => {
		this.props.history.pushState(null, menuItem.route);
	}

	toggleLeftNav = () => {
		this.refs.leftNav.toggle();
	}

	exit = (e) => {

		!!e && e.preventDefault();
		AppActions.logout();
	}
}

export default Header;