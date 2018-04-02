const HtmlWebpackPlugin = require("html-webpack-plugin");

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
		extensions: ['.js', '.jsx'],
	},
  	plugins: [
		htmlPlugin
	]
};