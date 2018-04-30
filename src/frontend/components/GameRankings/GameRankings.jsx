import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import { Header, Table, Icon, Pagination } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { SharedStyle as styles } from 'styles';

const numPerPage = 10;

export default class GameRankings extends Component {
    constructor(props) {
		super(props);
		this.state = {
			activePage: 1
		};

		this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(event, { activePage }) {
		this.setState({ activePage });
    }

    render() {
        const { activePage } = this.state;

        const players = _.sortBy(this.props.players, ({ netWorth }) => -netWorth); // sort by currRank?

        const upper = activePage * numPerPage;
        const playersShown = _.slice(players, (activePage - 1) * numPerPage, upper > players.length ? players.length : upper);
        const totalPages = Math.ceil(players.length / numPerPage);

        return (
            <div>
                <Header as='h2'>Rankings</Header>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell><Icon name='trophy' /></Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Net Worth</Table.HeaderCell>
                            <Table.HeaderCell>Trades</Table.HeaderCell>
                            <Table.HeaderCell>Net Return</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {_.map(playersShown, (p, index) => 
                            <Table.Row key={index}>
                                <Table.Cell>{p.currRank}</Table.Cell>
                                <Table.Cell>{p.username}</Table.Cell>
                                <Table.Cell>{formatCurrency(p.netWorth, { format: '%s%v', symbol: '$' })}</Table.Cell>
                                <Table.Cell>{p.numTrades}</Table.Cell>
                                <Table.Cell className={p.netReturn >= 0 ? styles.pos : styles.neg}>{formatCurrency(Math.abs(p.netReturn), { format: '%s%v', symbol: `${p.netReturn >= 0 ? '+' : '-'}$` })}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                {totalPages > 1 &&
                <div key='2' className={styles.center}>
                    <Pagination totalPages={totalPages} activePage={activePage} onPageChange={this.handlePageChange} />
                </div>}
            </div>
        );
    }
}
