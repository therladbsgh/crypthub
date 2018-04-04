import * as _ from 'lodash';
import React from 'react';
import { Tab, Header, Dropdown } from 'semantic-ui-react';
import { Searchbar, Game } from 'components';

// TODO: get games
const games = [
	{
		name: 'game1',
		description: 'desc1',
		host: 'user1',
		created: '1 sec ago',
		startOn: '04/03/18',
		endIn: '20 hours',
		numPlayers: '2'
	},
	{
		name: 'game2',
		description: 'desc2',
		host: 'user2',
		created: '10 sec ago',
		startOn: '04/02/18',
		endIn: '40 hours',
		numPlayers: '10'
	},
	{
		name: 'game3',
		description: 'desc3',
		host: 'user3',
		created: '25 sec ago',
		startOn: '04/01/18',
		endIn: '400 hours',
		numPlayers: '80'
	}
];

// TODO: get games
const pastGames = [
	{
		name: 'game1',
		description: 'desc1',
		host: 'user1',
		created: '1 sec ago',
		startOn: '04/03/18',
		endIn: '20 hours',
		numPlayers: '2'
	},
	{
		name: 'game2',
		description: 'desc2',
		host: 'user2',
		created: '10 sec ago',
		startOn: '04/02/18',
		endIn: '40 hours',
		numPlayers: '10'
	},
	{
		name: 'game3',
		description: 'desc3',
		host: 'user3',
		created: '25 sec ago',
		startOn: '04/01/18',
		endIn: '400 hours',
		numPlayers: '80'
	}
];

const YourGames = (props) => (
	<Tab.Pane key='tab1'>
		<Header as='h2'>Your Current Games</Header>
		{_.map(games, (game, index) =>
			<Game key={index} game={game} />
        )}
        <Header as='h2'>Your Past Games</Header>
		{_.map(pastGames, (game, index) =>
			<Game key={index} game={game} />
		)}
	</Tab.Pane>
)
  
export default YourGames
