import React from 'react';

class LoadingView extends React.Component {

	render () {
		return (
			<div className="loading">
				<div className="spinner">
					<div className="rect1"></div>
					<div className="rect2"></div>
					<div className="rect3"></div>
					<div className="rect4"></div>
					<div className="rect5"></div>
				</div>
			</div>
		);
	}
};

export default LoadingView;