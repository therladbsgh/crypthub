import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar } from 'components';
import { YourGames, FindGames } from './panes';

export default class UserPage extends Component {
  	render() {
        const paneProps = { foo: 'foo' };
        const panes = [
            { menuItem: 'Your Games', pane: YourGames(paneProps) },
            { menuItem: 'Find Games', pane: FindGames(paneProps) }
        ];
		return (
			<div>
				<Navbar loggedIn={true} />
				<Header as='h1'>Username</Header>
				<Tab panes={panes} renderActiveOnly={false} />
			</div>
		);
  	}
}
