var webpack = require('webpack');

module.exports = {
	entry: [
		__dirname + '/src/js/app/app.js'
	],
	output: {
		path: __dirname + '/build/js/',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['jsx', 'babel'],
				exclude: 'node_modules'
			}
		]
	},
	plugins: [
		new webpack.NoErrorsPlugin()
	]
};