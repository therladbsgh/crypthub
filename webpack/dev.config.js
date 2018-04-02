const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
	devServer: {
		stats: {
			errorDetails: true
		}
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: "[name]_[local]_[hash:base64]",
							sourceMap: true,
							minimize: true
						}
					},
					{
						loader: "sass-loader"
					}
				]
			}
		]
  	}
});