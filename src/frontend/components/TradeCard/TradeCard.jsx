import * as _ from 'lodash';
import React, { Component } from 'react';
import { Card, Header, Table, Form } from 'semantic-ui-react';
import { TradeModal, Searchbar } from 'components';
import { SharedStyle as styles } from 'styles';

export default class TradeCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results: ['RESET'],
			coins: _.sortBy(this.props.coins, c => -c.currPrice)
		};

		this.handleResults = this.handleResults.bind(this);
	}

	handleResults(results) {
		this.setState({ results });
	}

	render() {
		const { game, playerId, updateGame } = this.props;
		const { id, limitOrders, shortSelling, stopOrders } = game;
		const { results, coins } = this.state;

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
					<Header as='h2'>Trade a Coin</Header>
					<Form>
						<Form.Field>
							<label className={styles.left}>Search for a Coin</label>
							<Searchbar input={{ fluid: true }} placeholder='Coin name or symbol' source={coins} field='name' searchFields={['name', 'symbol']} handleResults={this.handleResults} open={false} />
						</Form.Field>
					</Form>
					{!_.isEmpty(results) ?
						<Table striped>
							<Table.Body>
								{_.map(coins, (c, index) => 
									(_.some(results, _.mapKeys(_.mapValues(c, v => String(v)), (v, k) => k.toLowerCase())) || results[0] === 'RESET') &&
										<Table.Row key={index}>
											<Table.Cell>{c.symbol}</Table.Cell>
											<Table.Cell textAlign='right'><TradeModal coin={c} orderTypes={orderTypes} gameId={id} playerId={playerId} updateGame={updateGame} /></Table.Cell>
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
