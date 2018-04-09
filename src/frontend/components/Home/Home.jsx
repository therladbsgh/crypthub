import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Button } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { Navbar } from 'components'; 
import { HomeStyle as styles } from 'styles';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: ''
		}

		GameBackend.getData()
		.then(res => {
			console.log('success! ', res);
		}, err => {
			console.log('error! ', err);
		});
	}

  	render() {
		return (
			<div>
				<Navbar loggedIn={false} />
				<Header as='h1'>CryptHub</Header>
				<Button as={Link} to={{
  					pathname: '/games',
					state: { 
						openTab: 2
					}
				}}>
					Create Game
				</Button>
				<Button as={Link} to={{
  					pathname: '/games',
					state: { 
						openTab: 1
					}
				}}>
					Find Game
				</Button>
			</div>
		);
  	}
}
