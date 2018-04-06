import * as _ from 'lodash';
import React, { Component } from 'react';
import { Tab, Header, Dropdown } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { GameMocks } from 'mocks';

// TODO: get games
const games = [
	GameMocks.game1,
	GameMocks.game2,
	GameMocks.game3
];

// TODO: get games
const pastGames = [
	GameMocks.game1,
	GameMocks.game2,
	GameMocks.game3
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
