import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Button } from 'semantic-ui-react';
import { Navbar } from 'components'; 
import { HomeStyle as styles } from 'styles';

class Home extends Component {
  	render() {
		console.log(this.props.cookies);
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

export default withCookies(Home);
