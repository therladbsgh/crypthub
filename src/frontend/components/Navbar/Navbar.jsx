import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { UserBackend } from 'endpoints';
import { Menu, Dropdown, Button } from 'semantic-ui-react';
import { NavbarStyle as styles } from 'styles';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        const { history, cookies } = this.props;

        UserBackend.logout()
		.then(res => {
            console.log('success! ', res);
            console.log(cookies.getAll());
            _.forEach(cookies.getAll(), (v, cookie) => cookies.remove(cookie));
            history.push('/');
		}, ({ err }) => {
            console.log('error! ', err);
            alert('Logout error: ', err);
        });
    }

  	render() {
        const user = this.props.cookies.getAll();

		return (
            <Menu inverted>
                <Menu.Item name='crypthub' as={Link} to='/' />

                <Menu.Menu position='right'>
                    <Menu.Item as={Link} to='/rankings' name='global rankings' />
                    {!_.isEmpty(user) ? 
                    <Dropdown item text={user.username}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to='/games'>Games</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    :
                    <Menu.Item>
                        <Button.Group>
                            <Button primary as={Link} to='/login'>Login</Button>
                            <Button.Or />
                            <Button positive as={Link} to='/signup'>Signup</Button>
                        </Button.Group>
                    </Menu.Item>}
                </Menu.Menu>
            </Menu>
		);
  	}
}

export default withCookies(withRouter(Navbar));
