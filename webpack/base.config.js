const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

const htmlPlugin = new HtmlWebpackPlugin({
	template: "./src/frontend/index.html",
	filename: "index.html"
});

module.exports = {
	entry: "./src/frontend/index.jsx",
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
			"styles": path.join(__dirname, '../src/frontend/stylesheets')
		}
	},
  	plugins: [
		htmlPlugin
	]
};