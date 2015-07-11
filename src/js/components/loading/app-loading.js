import React from 'react';

class LoadingView extends React.Component {

	render () {
		return (
			<div className="loading">
				<span onClick={this.props.onClick}>Loading...</span>
			</div>
		);
	}
};

export default LoadingView;