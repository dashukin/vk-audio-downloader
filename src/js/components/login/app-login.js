'use strict';

import React from 'react';
import ReactRouter from 'react-router';
import {Link} from 'react-router';
import VKProvider from '../../providers/provider-vk.js';
import AppConstants from '../../constants/app-constants.js';
import {RaisedButton} from 'material-ui';


class LoginView extends React.Component {

	render() {

		return (
			<div className="login-wrapper">
				<RaisedButton
					label="Login"
					primary={true}
					onClick={this.authorize}
				/>
			</div>
		);
	}

	authorize = (e) => {
		e.preventDefault();
		VKProvider.authorize();
	}
};

export default LoginView;