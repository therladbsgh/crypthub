import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'semantic-ui-react';
import { NavbarStyle as styles } from 'styles';

export default class Navbar extends Component {
  	render() {
		return (
            <Menu inverted>
                <Menu.Item name='crypthub' as={Link} to='/' />

                <Menu.Menu position='right'>
                    {this.props.loggedIn ? 
                    <Dropdown item text='Username'>
                        <Dropdown.Menu>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Games</Dropdown.Item>
                            <Dropdown.Item>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    :
                    <Menu.Item>
                        <Button.Group>
                            <Button primary as={Link} to='/signup'>Login</Button>
                            <Button.Or />
                            <Button positive as={Link} to='/signup'>Signup</Button>
                        </Button.Group>
                    </Menu.Item>}
                </Menu.Menu>
            </Menu>
		);
  	}
}
