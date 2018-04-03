import React, { Component } from "react";
import { Test2Style as styles } from 'styles';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: ""
		}

		fetch("http://localhost:5000/getData")
		.then(res => res.json())
		.then(
			(result) => {
				console.log(result.data);
				this.setState({
					data: result.data
				});
			},
			(error) => {
				console.log('ERROR:', error);
			}
		);
	}

  	render() {
		return (
	  		<div id={styles.homeid}>
				This is the home pasdfdfagffe. {this.state.data}
	  		</div>
		);
  	}
}
