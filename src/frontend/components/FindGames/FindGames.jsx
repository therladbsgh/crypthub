import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import date from 'date-and-time';
import { Tab, Header, Dropdown, Checkbox, Form, Pagination } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { FindGamesStyle as styles, SharedStyle as sharedStyles } from 'styles';

const sortOptions = [
	{
		text: 'Recently Created',
		value: 'Recently Created'
	},
	{
		text: 'Most Time Remaining',
		value: 'Most Time Remaining'
	},
	{
		text: 'Least Time Remaining',
		value: 'Least Time Remaining'
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

const numPerPage = 5;

class FindGames extends Component {
	constructor(props) {
		super(props);
		this.state = {
			games: _.sortBy(this.props.games, g => -new Date(g.created)),
			activePage: 1,
			sortValue: 'Recently Created',
			onlyPublic: false
		};

		this.getSortedGames = this.getSortedGames.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
	}

	getSortedGames(games, sort) {
		const now = new Date();
		var sorted = games;
		switch (sort) {
			case 'Most Time Remaining':
				sorted = _.sortBy(games, g => -date.subtract(new Date(g.end), now).toMilliseconds());
				break;
			case 'Least Time Remaining':
				sorted = _.sortBy(games, g => date.subtract(new Date(g.end), now).toMilliseconds());
				break;
			case 'Start Date':
				sorted = _.sortBy(games, g => new Date(g.start));
				break;
			case 'Most Players':
				sorted = _.sortBy(games, g => -g.players.length);
				break;
			case 'Fewest Players':
				sorted = _.sortBy(games, g => g.players.length);
				break;
			default:
				sorted = _.sortBy(games, g => -new Date(g.created));
				break;
		}

		return sorted;
	}

	handleSortChange(event, { value }) {
		const { games, sortValue } = this.state;

		if (value !== sortValue) {
			this.setState({
				games: this.getSortedGames(games, value),
				sortValue: value
			});
		}
	}

	handlePageChange(event, { activePage }) {
		this.setState({ activePage });
	}

	handleCheckboxChange(event, { checked }) {
		const { games, activePage, sortValue } = this.state;

		const oldNumPages = Math.ceil(games.length / numPerPage);
		const sorted = this.getSortedGames(checked ? _.filter(games, { isPrivate: false }) : this.props.games, sortValue);
		const newNumPages = Math.ceil(sorted.length / numPerPage);

		this.setState({
			games: sorted,
			activePage: newNumPages < oldNumPages && activePage > newNumPages ? newNumPages : activePage,
			onlyPublic: checked
		});
	}

	render() {
		const fullGames = this.props.games;
		const { games, activePage, sortValue, onlyPublic } = this.state;
		
		const upper = activePage * numPerPage;
		const gamesShown = _.slice(games, (activePage - 1) * numPerPage, upper > games.length ? games.length : upper);
		
		const totalPages = Math.ceil(games.length / numPerPage);

		return (
			<div>
				<Header as='h2'>Find a Game</Header>
				<Form>
					<Form.Field className={styles.search}>
						<label>Search for a Game</label>
						<Searchbar placeholder='Game name' source={fullGames} field='name' searchFields={['name']} resultRenderer={({ name }) => name} onResultSelect={(e, d) => this.props.history.push(`/game/${d.result.id}`)} />
					</Form.Field>
				</Form>
				<Header as='h2'>Current Games</Header>
				<label id={styles.sortLabel}>Sort By</label>
				<Dropdown placeholder='Sort By' selection options={sortOptions} value={sortValue} onChange={this.handleSortChange} />
				<Checkbox className={styles.onlyPublic} label='Only show public games' checked={onlyPublic} onChange={this.handleCheckboxChange} />
				{_.map(gamesShown, (game, index) =>
					<GameCard key={index} game={game} />
				)}
				{totalPages > 1 &&
				<div className={sharedStyles.center} id={sharedStyles.card}>
					<Pagination totalPages={totalPages} activePage={activePage} onPageChange={this.handlePageChange} />
				</div>}
			</div>
		);
	}
}

// This puts the history prop on props which allows for redirection
export default withRouter(FindGames);
