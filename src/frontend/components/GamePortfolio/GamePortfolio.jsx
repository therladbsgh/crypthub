import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';
import { Transactions } from 'components';

export default class GamePortfolio extends Component {
	constructor(props) {
		super(props);

		this.state = {
			history: true
		};

		this.setHistory = this.setHistory.bind(this);
	}

	setHistory(bool) {
		this.setState({ history: bool });
	}
	
	render() {
		const { player } = this.props;
		const { history } = this.state;
		const transactions = player.transactions;

		return (
			<div>
				<Header as='h2'>Your Portfolio</Header>
				{JSON.stringify(player.portfolio)}
				<Header as='h2'>Transactions</Header>
				<Button.Group>
					<Button toggle active={history} onClick={() => this.setHistory(true)}>History</Button>
					<Button toggle active={!history} onClick={() => this.setHistory(false)}>Current Orders</Button>
				</Button.Group>
				<Transactions transactions={this.state.history ? transactions.history : transactions.current} />
			</div>
		);
	}
}