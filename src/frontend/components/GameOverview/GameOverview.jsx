import * as _ from 'lodash';
import React, { Component } from 'react';
import { Tab, Header, Dropdown } from 'semantic-ui-react';
import { Searchbar, ProfileCard, GameCard } from 'components';

export default class GameOverview extends Component {
    render() {
        const { game, thisPlayer } = this.props;
        const players = game.players;

        return (
			<div>
				<Header as='h2'>Your Profile</Header>
				<ProfileCard player={players[thisPlayer]} />
				<Header as='h2'>About This Game</Header>
                <GameCard game={game} />
			</div>
        );
    }
}
