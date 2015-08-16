'use strict';

import React from 'react';
import ReactRouter from 'react-router';
import {Link} from 'react-router';
import VKProvider from '../../providers/provider-vk.js';

class LoginView extends React.Component {

	render() {
		return (
			<div className="login-wrapper">
				<a className="btn btn-primary" href="#" onClick={VKProvider.authorize}>Login</a>
			</div>
		);
	}
};

export default LoginView;