import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Button, Icon, Container } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components'; 
import { UserSettingsStyle as styles, SharedStyle as sharedStyles } from 'styles';

class UserSettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
            username: '',
			hasMounted: false
		};
	}

	componentWillMount() {
		const { history } = this.props;
		UserBackend.getUsername()
		.then(res => {
			console.log('success! ', res);
            if (_.isEmpty(res)) {
				history.push({ pathname: '/login', redirected: true });
			} else {
                this.setState({ username: res.username, hasMounted: true });
			}
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
	}

  	render() {
        const { username, hasMounted } = this.state;

		return (
			hasMounted &&
			<div className={sharedStyles.container}>
				<Navbar username={username} />
				<Container id={styles.container}>
					<Header as='h1'>Welcome, {username}</Header>
                    <Header as='h3'>Your email is: EMAIL HERE</Header>
                    {/* <ChangeEmailModal /> */}
                    <Header as='h3'>Change Password</Header>

				</Container>
			</div>
		);
  	}
}

export default withRouter(UserSettings);
