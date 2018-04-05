import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tab, Header, Dropdown, Checkbox } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
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
		key: '1',
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
		key: '2',
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
		key: '3',
		id: '3'
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

export default class FindGames extends Component {
	constructor(props) {
		super(props);
		this.state = {
            sortValue: 'Recently Created',
            onlyPublic: false
		};
	
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
	}
	
	// TODO: Logic
    handleSortChange(event, { value }) {
        this.setState({ sortValue: value });
        
    }

    // TODO: Logic
    handleCheckboxChange(event, { checked }) {
        this.setState({ onlyPublic: checked });
    }

    render() {
        return (
			<div>
				<Header as='h2'>Search for a Game</Header>
				<Searchbar placeholder='Game name' source={source} field='name' resultRenderer={({ name }) => name}/>
				<Header as='h2'>Current Games</Header>
				<label id={styles.sortLabel}>Sort By</label>
				<Dropdown placeholder='Sort By' selection options={sortOptions} value={this.state.sortValue} onChange={this.handleSortChange} />
				<Checkbox className={styles.onlyPublic} label='Only show public games' checked={this.state.onlyPublic} onChange={this.handleCheckboxChange} />
				{_.map(games, (game, index) =>
					<GameCard key={index} game={game} />
				)}
			</div>
        );
    }
}
