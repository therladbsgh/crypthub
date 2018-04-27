import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import { Header, Table, Icon } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { SharedStyle as styles } from 'styles';

export default class GameRankings extends Component {
    render() {
        const players = _.sortBy(this.props.players, ({ netWorth }) => -netWorth);

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
                        {_.map(players, (p, index) => 
                            <Table.Row key={index}>
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>{p.username}</Table.Cell>
                                <Table.Cell>{formatCurrency(p.netWorth, { format: '%s%v', symbol: '$' })}</Table.Cell>
                                <Table.Cell>{p.numTrades}</Table.Cell>
                                <Table.Cell className={p.netReturn >= 0 ? styles.pos : styles.neg}>{formatCurrency(Math.abs(p.netReturn), { format: '%s%v', symbol: `${p.netReturn >= 0 ? '+' : '-'}$` })}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
