import React from 'react';
import {Link, RouteHandler} from 'react-router';

class Navigation extends React.Component {
	render () {
		return (
			<div className="container">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<Link to="search">Search</Link>
						<Link to="my-audio">My audio <span class="badge">42</span></Link>
						<RouteHandler />
					</div>
				</div>
			</div>
		);
	}
};

export default Navigation;