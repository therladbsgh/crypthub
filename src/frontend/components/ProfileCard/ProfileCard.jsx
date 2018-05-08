import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import { Card, Grid } from 'semantic-ui-react';
import { ProfileCardStyle as styles, SharedStyle as sharedStyles } from 'styles';

export default class ProfileCard extends Component {
    render() {
		const { player, completed, startingBalance } = this.props;
		const { username, netWorth, todayReturn, netReturn, currRank, portfolio, buyingPower, shortReserve, transactionCurrent, tradingBots, activeBotId } = player;
		
		// const todayReturn = ((startingBalance - netWorth) / startingBalance) * 100;

        return (
			<Card id={sharedStyles.card}>
				<Card.Content>
				    <Card.Header className={styles.header}>
						{username}
					</Card.Header>
					<Grid columns={4} className={styles.profile}>
						<Grid.Row>
							<Grid.Column>
								<label>Net Worth</label>
								<p>{formatCurrency(netWorth, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>{completed ? 'Final Day\'s Return' : 'Today\'s Return'}</label>
								<p className={todayReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{todayReturn >= 0 ? '+' : ''}{formatCurrency(todayReturn, { format: '%v%s', symbol: '%' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Net Return</label>
								<p className={netReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{formatCurrency(Math.abs(netReturn), { format: '%s%v', symbol: `${netReturn >= 0 ? '+' : '-'}$` })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Current Rank</label>
								<p>{currRank}</p>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<label>Current Cash</label>
								<p>{formatCurrency(_.find(portfolio, a => a.coin.symbol === 'USD').amount, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Buying Power</label>
								<p>{formatCurrency(_.find(portfolio, a => a.coin.symbol === 'USD').amount, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Short Reserve</label>
								<p>{formatCurrency(shortReserve, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Open Trades</label>
								<p>{transactionCurrent.length}</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Card.Content>
				{activeBotId && tradingBots &&
				<Card.Content extra>
					<strong>Active Trading Bot: </strong>{_.find(tradingBots, { _id: activeBotId }).name}
				</Card.Content>}
		  	</Card>
		);
  	}
}
