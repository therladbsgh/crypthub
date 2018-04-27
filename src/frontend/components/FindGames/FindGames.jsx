import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Tab, Header, Dropdown, Checkbox } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { FindGamesStyle as styles } from 'styles';

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

class FindGames extends Component {
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
		const { games } = this.props;
		
		return (
			<div>
				<Header as='h2'>Search for a Game</Header>
				<Searchbar placeholder='Game name' source={games} field='name' searchFields={['name']} resultRenderer={({ name }) => name} onResultSelect={(e, d) => this.props.history.push(`/game/${d.result.id}`)} />
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

// This puts the history prop on props which allows for redirection
export default withRouter(FindGames);
