'use strict';

import React from 'react';
import AppStore from '../../stores/app-store.js';
import AppDispatcher from '../../dispatchers/app-dispatcher.js';
import AppActions from '../../actions/app-actions.js';
import AppConstants from '../../constants/app-constants.js';

let Header = React.createClass({
	getInitialState () {
		return {
			firstName: '',
			lastName: ''
		};
	},
	componentWillMount () {
		let self = this;
		AppDispatcher.register((payload) => {
			if (payload.actionType !== AppConstants.USER_INFO) return;
			self.setState({
				firstName: payload.userInfo.firstName,
				lastName: payload.userInfo.lastName
			});
		});
	},
	componentDidMount () {

	},
	render () {
		let userName = this.state.firstName ? ', ' + this.state.firstName + (this.state.lastName ? ' ' + this.state.lastName + '!' : '!') : '!';
		return (
			<div className="navbar navbar-default">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<ul className="nav navbar-nav list-unstyled">
								<li>
									<a>Welcome{userName}</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

export default Header;