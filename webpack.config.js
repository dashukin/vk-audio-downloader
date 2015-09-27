var webpack = require('webpack');

module.exports = {
	entry: [
		__dirname + '/src/js/app/app-base.js'
	],
	output: {
		path: __dirname + '/build/js/',
		filename: 'vk-audio-downloader.bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['jsx', 'babel?optional[]=es7.classProperties'],
				exclude: 'node_modules'
			}
		]
	},
	plugins: [
		new webpack.NoErrorsPlugin()
		//,new webpack.optimize.UglifyJsPlugin({minimize: true})
	]
};