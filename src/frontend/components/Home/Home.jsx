import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Button } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components'; 
import { HomeStyle as styles } from 'styles';

class Home extends Component {
	componentWillMount() {
		const { history, cookies } = this.props;
		if (!_.isEmpty(cookies.getAll())) {
			history.push('/games');
		}
	}

  	render() {
		return (
			<div>
				<Navbar />
				<Header as='h1'>CryptHub</Header>
				<Button as={Link} to='/login'>
					Create Game
				</Button>
				<Button as={Link} to='/login'>
					Find Game
				</Button>
			</div>
		);
  	}
}

export default withCookies(withRouter(Home));
