import React, { Component } from 'react';
import { NavbarStyle as styles } from 'styles';

export default class Navbar extends Component {
  	render() {
		return (
	  		<div>
                <div id={styles.logo}>
				    CryptHub
                </div>
                <div id={styles.login}>
				    {this.props.loggedIn ? 'Username' : 'Signup | Login'}
                </div>
                <hr />
            </div>
		);
  	}
}
