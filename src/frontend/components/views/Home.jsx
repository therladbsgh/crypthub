import React, { Component } from "react";

import styles from '../../stylesheets/test2.scss';

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
				This is the home pagffe. {this.state.data}
	  		</div>
		);
  	}
}
