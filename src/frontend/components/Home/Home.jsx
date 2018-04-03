import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'components'; 
import { HomeStyle as styles } from 'styles';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: ''
		}

		fetch('http://localhost:5000/getData')
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
			<div>
				<Navbar loggedIn={false} />
				<div id={styles.homeid}>
					This is the home page. {this.state.data}
				</div>
				<Link to="/signup">
					<button type="button">
						Create Game
					</button>
				</Link>
				<Link to="/signup">
					<button type="button">
						Find Game
					</button>
				</Link>
			</div>
		);
  	}
}
