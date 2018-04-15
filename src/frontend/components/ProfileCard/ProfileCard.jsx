import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import { Card, Grid } from 'semantic-ui-react';
import { ProfileCardStyle as styles, SharedStyle as sharedStyles } from 'styles';

export default class ProfileCard extends Component {
    render() {
        const { player } = this.props;
        
        return (
			<Card id={sharedStyles.card}>
				<Card.Content>
				    <Card.Header className={styles.header}>
						{player.name}
					</Card.Header>
					<Grid columns={4} className={styles.profile}>
						<Grid.Row>
							<Grid.Column>
								<label>Net Worth</label>
								<p>{formatCurrency(player.netWorth, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Today's Return</label>
								<p className={player.todayReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{formatCurrency(player.todayReturn, { format: '%v%s', symbol: '%' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Net Return</label>
								<p className={player.netReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{formatCurrency(Math.abs(player.netReturn), { format: '%s%v', symbol: `${player.netReturn >= 0 ? '+' : '-'}$` })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Current Rank</label>
								<p>{player.currRank}</p>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<label>Current Cash</label>
								<p>{formatCurrency(_.find(player.portfolio, { name: 'USD' }).amount, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Buying Power</label>
								<p>{formatCurrency(player.buyingPower, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Short Reserve</label>
								<p>{formatCurrency(player.shortReserve, { format: '%s%v', symbol: '$' })}</p>
							</Grid.Column>
							<Grid.Column>
								<label>Open Trades</label>
								<p>{player.transactions.current.length}</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Card.Content>
		  	</Card>
		);
  	}
}
