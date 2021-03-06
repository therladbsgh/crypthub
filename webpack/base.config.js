const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

const htmlPlugin = new HtmlWebpackPlugin({
	template: "./src/frontend/index.html",
	filename: "index.html"
});

const PUBLIC_PATH = process.env.MODE == 'production' ? '/' : 'http://localhost:8080';

module.exports = {
		entry: "./src/frontend/index.jsx",
		output: {
			publicPath: PUBLIC_PATH
		},
		devServer: {
			historyApiFallback: true
		},
		module: {
			rules: [
				{
					test: /\.js|.jsx?$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader"
					}
				}
			]
		},
		resolve: {
			extensions: ['.js', '.jsx', '.scss'],
			alias: {
				"components": path.join(__dirname, '../src/frontend/components'),
				"styles": path.join(__dirname, '../src/frontend/stylesheets'),
				"mocks": path.join(__dirname, '../src/common/mocks'),
				"endpoints": path.join(__dirname, '../src/frontend/endpoints'),
				"docs": path.join(__dirname, '../src/common/docs')
			}
		},
		plugins: [
			htmlPlugin
		]
};