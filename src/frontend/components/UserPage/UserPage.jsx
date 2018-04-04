import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar } from 'components';
import { YourGames, FindGames, CreateGame } from 'components';

export default class UserPage extends Component {    
  	render() {
        const YourGamesPane = (
            <Tab.Pane key='tab1'>
                <YourGames />
            </Tab.Pane>
        );
        const FindGamesPane = (
            <Tab.Pane key='tab2'>
                <FindGames />
            </Tab.Pane>
        );
        const CreateGamePane = (
            <Tab.Pane key='tab3'>
                <CreateGame />
            </Tab.Pane>
        );

        const panes = [
            { menuItem: 'Your Games', pane: YourGamesPane },
            { menuItem: 'Find Games', pane: FindGamesPane },
            { menuItem: 'Create Game', pane: CreateGamePane }
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
