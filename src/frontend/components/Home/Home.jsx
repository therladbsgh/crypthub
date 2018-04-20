import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Button, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components'; 
import { HomeStyle as styles } from 'styles';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasMounted: false
		};
	}

	componentWillMount() {
		const { history } = this.props;
		UserBackend.getUsername()
		.then(res => {
			console.log('success! ', res);
            if (_.isEmpty(res)) {
				this.setState({ hasMounted: true });
			} else {
				history.push('/games');
			}
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
	}

  	render() {
		return (
			this.state.hasMounted &&
			<div>
				<Navbar username={''} />
				<Header as='h1'>CryptHub</Header>
				<Button icon='add circle' positive as={Link} to='/login' content='Create Game' />
				<Button icon='search' primary as={Link} to='/login' content='Find Game' />
			</div>
		);
  	}
}

export default withRouter(Home);
