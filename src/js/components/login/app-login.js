'use strict';

import React from 'react';
import ReactRouter from 'react-router';
import {Link} from 'react-router';
import VKProvider from '../../providers/provider-vk.js';
import AppConstants from '../../constants/app-constants.js';

class LoginView extends React.Component {

	componentDidMount () {

	}

	render() {

		return (
			<div className="login-wrapper">
				<a className="btn btn-primary" ref="authLink" href="#" onClick={this.authorize.bind(this)}>Login</a>
			</div>
		);
	}

	authorize (e) {
		e.preventDefault();
		VKProvider.authorize();
	}
};

export default LoginView;