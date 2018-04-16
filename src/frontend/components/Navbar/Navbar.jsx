import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserBackend } from 'endpoints';
import { Menu, Dropdown, Button } from 'semantic-ui-react';
import { NavbarStyle as styles } from 'styles';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            hasMounted: false
        };

        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
		UserBackend.getUser()
		.then(res => {
			console.log('success! ', res);
            this.setState({ username: res.user, hasMounted: true });
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
	}

    logout() {
        const { history } = this.props;

        UserBackend.logout()
		.then(res => {
            console.log('success! ', res);
            history.push('/');
		}, ({ err }) => {
            console.log('error! ', err);
            alert(`Logout error: ${err}`);
        });
    }

  	render() {
        const { username, hasMounted } = this.state;
        
		return (
            hasMounted &&
            <Menu inverted>
                <Menu.Item name='crypthub' as={Link} to={username ? '/games' : '/'} />

                <Menu.Menu position='right'>
                    <Menu.Item as={Link} to='/rankings' name='global rankings' />
                    {username ? 
                    <Dropdown item text={username}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to='/games'>Games</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    :
                    [<Menu.Item key='signup' as={Link} to='/signup'>
                        Signup
                    </Menu.Item>,
                    <Menu.Item key='login' as={Link} to='/login'>
                        Login
                    </Menu.Item>]}
                </Menu.Menu>
            </Menu>
		);
  	}
}

export default withRouter(Navbar);
