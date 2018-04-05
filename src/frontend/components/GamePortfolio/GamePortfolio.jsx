import * as _ from 'lodash';
import React, { Component } from 'react';
import { Tab, Header, Dropdown } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';

export default class GamePortfolio extends Component {
    render() {
        const { player } = this.props;

        return (
			<div>
				<Header as='h2'>Your Portfolio</Header>
				{JSON.stringify(player.portfolio)}
				<Header as='h2'>Transactions</Header>
                {JSON.stringify(player.transactions)}
			</div>
        );
    }
}
