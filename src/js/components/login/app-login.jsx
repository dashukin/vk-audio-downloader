'use strict';

import React from 'react';
import ReactRouter from 'react-router';
import {Link} from 'react-router';
import AppStore from '../../stores/app-store.js';

class LoginView extends React.Component {

	render() {
		return (
			<div className="login-wrapper">
				<a className="btn btn-primary" href="#" onClick={AppStore.runAuthorization}>Login</a>
			</div>
		);
	}
};

export default LoginView;