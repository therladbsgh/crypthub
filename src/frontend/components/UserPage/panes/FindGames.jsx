import * as _ from 'lodash';
import PropTypes from 'prop-types';
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
		numPlayers: '2',
		key: '1'
	},
	{
		name: 'game2',
		description: 'desc2',
		host: 'user2',
		created: '10 sec ago',
		startOn: '04/02/18',
		endIn: '40 hours',
		numPlayers: '10',
		key: '2'
	},
	{
		name: 'game3',
		description: 'desc3',
		host: 'user3',
		created: '25 sec ago',
		startOn: '04/01/18',
		endIn: '400 hours',
		numPlayers: '80',
		key: '3'
	}
];

const sortOptions = [
	{
		text: 'Recently Created',
		value: 'Recently Created'
	},
	{
		text: 'Most Days Remaining',
		value: 'Most Days Remaining'
	},
	{
		text: 'Least Days Remaining',
		value: 'Least Days Remaining'
	},
	{
		text: 'Start Date',
		value: 'Start Date'
	},
	{
		text: 'Most Players',
		value: 'Most Players'
	},
	{
		text: 'Fewest Players',
		value: 'Fewest Players'
	}
];

const source = [
	{
		name: 'game1',
		key: '1'
	},
	{
		name: 'game2',
		key: '2'
	},
	{
		name: 'game3',
		key: '3'
	}
];

const FindGames = (props) => (
	<Tab.Pane key='tab2'>
		<Header as='h2'>Search for a Game</Header>
		<Searchbar placeholder='Game name' source={source} field='name' resultRenderer={({ name }) => name}/>
		<Header as='h2'>Current Games</Header>
		<Dropdown placeholder='Sort By' selection options={sortOptions} onChange={props.handleChange} />
		{_.map(games, (game, index) =>
			<Game key={index} game={game} />
		)}
	</Tab.Pane>
)
  
export default FindGames
