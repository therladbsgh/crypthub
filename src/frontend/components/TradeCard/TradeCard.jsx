import React, { Component } from 'react';
import { Card, Header, Table } from 'semantic-ui-react';
import { TradeModal, Searchbar } from 'components';
import { CoinMocks } from 'mocks';

export default class TradeCard extends Component {
	render() {
		const { game } = this.props;
		return (
			<Card>
				<Card.Content>
					<Header as='h2'>Search/Trade a Coin</Header>
					<Searchbar placeholder='Coin name or symbol' source={CoinMocks.coins} field='name' />
					<Table striped>
						<Table.Body>
							{_.map(CoinMocks.coins, (c, index) => 
								<Table.Row key={index}>
									<Table.Cell>{c.symbol}</Table.Cell>
									<Table.Cell textAlign='right'><TradeModal coin={c} /></Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table>
				</Card.Content>
		  	</Card>
		);
  	}
}
