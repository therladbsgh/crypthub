const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssPlugin = new MiniCssExtractPlugin({
	filename: "styles.css",
})

module.exports = merge(baseConfig, {
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
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
  	},
  	plugins: [
		cssPlugin
	]
});