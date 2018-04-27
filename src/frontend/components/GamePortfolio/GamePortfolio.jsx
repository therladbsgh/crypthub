import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';
import { Portfolio, Transactions } from 'components';

export default class GamePortfolio extends Component {
	constructor(props) {
		super(props);

		this.state = {
			history: false
		};

		this.setHistory = this.setHistory.bind(this);
	}

	setHistory(bool) {
		this.setState({ history: bool });
	}
	
	render() {
		const { gameId, player, completed } = this.props;
		const { history } = this.state;

		return (
			<div>
				<Header as='h2'>Your Portfolio</Header>
				<Portfolio portfolio={player.portfolio} completed={completed} />
				<Header as='h2'>Transactions</Header>
				<Button.Group>
					<Button toggle active={!history} onClick={() => this.setHistory(false)}>Current Orders</Button>
					<Button toggle active={history} onClick={() => this.setHistory(true)}>History</Button>					
				</Button.Group>
				<Transactions gameId={gameId} playerId={player._id} transactions={history ? player.transactionHistory : player.transactionCurrent} current={!history} />
			</div>
		);
	}
}
