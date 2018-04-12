import React, { Component } from 'react';
import { Card, Header, Table } from 'semantic-ui-react';
import { TradeModal, Searchbar } from 'components';
import { CoinMocks } from 'mocks';
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
		const { game } = this.props;
		const { results } = this.state;

		return (
			<Card>
				<Card.Content className={styles.center}>
					<Header as='h2'>Search/Trade a Coin</Header>
					<Searchbar placeholder='Coin name or symbol' source={CoinMocks.coins} field='name' searchFields={['name', 'symbol']} handleResults={this.handleResults} open={false} />
					{!_.isEmpty(results) ?
						<Table striped>
							<Table.Body>
								{_.map(CoinMocks.coins, (c, index) => 
									(_.some(results, _.mapKeys(c, (v, k) => k.toLowerCase())) || results[0] === 'RESET') &&
										<Table.Row key={index}>
											<Table.Cell>{c.symbol}</Table.Cell>
											<Table.Cell textAlign='right'><TradeModal coin={c} /></Table.Cell>
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
