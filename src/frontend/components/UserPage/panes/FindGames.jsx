import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Tab, Header, Dropdown, Checkbox } from 'semantic-ui-react';
import { Searchbar, Game } from 'components';
import { FindGamesStyle as styles } from 'styles';

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

// Necessary to pull just name and key out for search result generation
const source = _.map(games, ({ name }, key) => ({ name, key }));

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

const FindGames = (props) => (
	<Tab.Pane key='tab2'>
		<Header as='h2'>Search for a Game</Header>
		<Searchbar placeholder='Game name' source={source} field='name' resultRenderer={({ name }) => name}/>
		<Header as='h2'>Current Games</Header>
		<Dropdown placeholder='Sort By' selection options={sortOptions} onChange={props.handleSortChange} />
		<Checkbox className={styles.onlyPublic} label='Only show public games' onChange={props.handleCheckboxChange} />
		{_.map(games, (game, index) =>
			<Game key={index} game={game} />
		)}
	</Tab.Pane>
)
  
export default FindGames
