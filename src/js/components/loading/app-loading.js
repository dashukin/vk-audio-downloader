import React from 'react';
import {CircularProgress} from 'material-ui';

class LoadingView extends React.Component {

	render () {
		return (
			<div className="loading">
				<CircularProgress
					mode="indeterminate"
					size={this.props.size || 0.5}
				/>
			</div>
		);
	}
};

export default LoadingView;