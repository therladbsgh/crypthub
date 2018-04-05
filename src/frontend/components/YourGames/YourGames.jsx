import * as _ from 'lodash';
import React, { Component } from 'react';
import { Tab, Header, Dropdown } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';

// TODO: get games
const games = [
	{
		name: 'game1',
		description: 'desc1',
		host: 'user1',
		created: '1 sec ago',
		startOn: '04/03/18',
		endIn: '20 hours',
		numPlayers: '2',
		id: '1'
	},
	{
		name: 'game2',
		description: 'desc2',
		host: 'user2',
		created: '10 sec ago',
		startOn: '04/02/18',
		endIn: '40 hours',
		numPlayers: '10',
		id: '2'
	},
	{
		name: 'game3',
		description: 'desc3',
		host: 'user3',
		created: '25 sec ago',
		startOn: '04/01/18',
		endIn: '400 hours',
		numPlayers: '80',
		id: '3'
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
		numPlayers: '2',
		id: '1'
	},
	{
		name: 'game2',
		description: 'desc2',
		host: 'user2',
		created: '10 sec ago',
		startOn: '04/02/18',
		endIn: '40 hours',
		numPlayers: '10',
		id: '2'
	},
	{
		name: 'game3',
		description: 'desc3',
		host: 'user3',
		created: '25 sec ago',
		startOn: '04/01/18',
		endIn: '400 hours',
		numPlayers: '80',
		id: '3'
	}
];

export default class YourGames extends Component {
    render() {
        return (
			<div>
				<Header as='h2'>Your Current Games</Header>
				{_.map(games, (game, index) =>
					<GameCard key={index} game={game} />
				)}
				<Header as='h2'>Your Past Games</Header>
				{_.map(pastGames, (game, index) =>
					<GameCard key={index} game={game} />
				)}
			</div>
        );
    }
}
