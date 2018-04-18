import * as _ from 'lodash';
import React, { Component } from 'react';
import { Tab, Header, Dropdown } from 'semantic-ui-react';
import { Searchbar, ProfileCard, GameCard } from 'components';

export default class GameOverview extends Component {
    render() {
        const { game, thisPlayer, completed, inGame } = this.props;

        return (
			<div>
				{inGame && 
                [<Header key='1' as='h2'>Your Profile</Header>,
                <ProfileCard key='2' player={thisPlayer} completed={completed} />]}
				<Header as='h2'>About This Game</Header>
                <GameCard game={game} />
			</div>
        );
    }
}
