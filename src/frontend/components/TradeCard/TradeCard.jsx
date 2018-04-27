import React, { Component } from 'react';
import { Card, Header, Table } from 'semantic-ui-react';
import { TradeModal, Searchbar } from 'components';
import { SharedStyle as styles } from 'styles';

export default class TradeCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results: ['RESET']
		};

		this.handleResults = this.handleResults.bind(this);
	}

	handleResults(results) {
		this.setState({ results });
	}

	render() {
		const { game, playerId, coins } = this.props;
		const { id, limitOrders, shortSelling, stopOrders } = game;
		const { results } = this.state;

		const orderTypes = [
			{
				text: 'Market Order',
				value: 'market'
			},
			...limitOrders ? [{
				text: 'Limit Order',
				value: 'limit'
			}] : [],
			...shortSelling ? [{
				text: 'Short Sell',
				value: 'short'
			}] : [],
			...stopOrders ? [{
				text: 'Stop Order',
				value: 'stop'
			}] : [],
		];

		return (
			<Card>
				<Card.Content className={styles.center}>
					<Header as='h2'>Search/Trade a Coin</Header>
					<Searchbar input={{ fluid: true }} placeholder='Coin name or symbol' source={coins} field='name' searchFields={['name', 'symbol']} handleResults={this.handleResults} open={false} />
					{!_.isEmpty(results) ?
						<Table striped>
							<Table.Body>
								{_.map(coins, (c, index) => 
									(_.some(results, _.mapKeys(_.mapValues(c, v => String(v)), (v, k) => k.toLowerCase())) || results[0] === 'RESET') &&
										<Table.Row key={index}>
											<Table.Cell>{c.symbol}</Table.Cell>
											<Table.Cell textAlign='right'><TradeModal coin={c} orderTypes={orderTypes} gameId={id} playerId={playerId} /></Table.Cell>
										</Table.Row>
								)}
							</Table.Body>
						</Table>
						:
						<Header as='h3'>No coins found</Header>
					}
				</Card.Content>
		  	</Card>
		);
  	}
}
