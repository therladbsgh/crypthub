import * as _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

export default class Transactions extends Component {
    render() {
        const { transactions } = this.props;

        return (
			<Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Side</Table.HeaderCell>
                        <Table.HeaderCell>Size</Table.HeaderCell>
                        <Table.HeaderCell>Coin</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {_.map(transactions, (t, index) => 
                        <Table.Row key={index}>
                            <Table.Cell>{t.side}</Table.Cell>
                            <Table.Cell>{t.size}</Table.Cell>
                            <Table.Cell>{t.symbol}</Table.Cell>
                            <Table.Cell>{t.price}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}
