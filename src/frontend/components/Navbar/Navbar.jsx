import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserBackend } from 'endpoints';
import { Menu, Dropdown, Button, Icon } from 'semantic-ui-react';
import { NavbarStyle as styles } from 'styles';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
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
        const { username } = this.props;
        
		return (
            <Menu id={styles.navbar} inverted>
                <Menu.Item name='home' as={Link} to={username ? '/games' : '/'}>
                    <Icon name='home' />CryptHub
                </Menu.Item>

                <Menu.Menu position='right'>
                    <Menu.Item as={Link} to='/rankings'>
                        <Icon name='trophy' />Global Rankings
                    </Menu.Item>
                    <Menu.Item as={Link} to='/docs'>
                        <Icon name='file code outline' />API Documentation
                    </Menu.Item>
                    {username ? 
                    <Dropdown item text={username}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to='/games'><Icon name='game' />Games</Dropdown.Item>
                            <Dropdown.Item><Icon name='setting' />Settings</Dropdown.Item>
                            <Dropdown.Item onClick={this.logout}><Icon name='sign out' />Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    :
                    [<Menu.Item key='signup' as={Link} to='/signup'>
                        <Icon name='signup' />Signup
                    </Menu.Item>,
                    <Menu.Item key='login' as={Link} to='/login'>
                        <Icon name='sign in' />Login
                    </Menu.Item>]}
                </Menu.Menu>
            </Menu>
		);
  	}
}

export default withRouter(Navbar);
