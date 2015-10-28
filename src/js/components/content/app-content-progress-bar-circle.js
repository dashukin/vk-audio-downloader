/*
*
* */

'use strict';

import React from 'react';

class CircleProgressBar extends React.Component {

	shouldComponentUpdate (newProps) {
		return true;
	}

	render () {

		var percents,
			totalRotation,
			leftSideRotation,
			rightSideRotation;

		percents = this.props.percents;

		totalRotation = percents >= 100 ? 360 : parseInt(360 / 100 * percents, 10);

		rightSideRotation = totalRotation > 180 ? 180 : totalRotation;

		leftSideRotation = totalRotation > 180 ? totalRotation - 180 : 0;

		return (
			<div className="progress-bar-wrapper">
				<div className="progress-bar-outer">
					<div className="progress-bar-overlay-clip progress-bar-overlay-clip-right">
						<div className="progress-bar-overlay progress-bar-overlay-right" style={{transform: "rotate(" + rightSideRotation + "deg)"}}></div>
					</div>
					<div className="progress-bar-overlay-clip progress-bar-overlay-clip-left">
						<div className="progress-bar-overlay progress-bar-overlay-left" style={{transform: "rotate(" + leftSideRotation + "deg)"}}></div>
					</div>
					<div className="progress-bar-inner"></div>
				</div>
			</div>
		);

	}

}

export default CircleProgressBar;
