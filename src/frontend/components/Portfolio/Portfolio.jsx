import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import date from 'date-and-time';
import { Table } from 'semantic-ui-react';

export default class Portfolio extends Component {
    render() {
        const { portfolio } = this.props;

        return (
			<Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>% of Holdings</Table.HeaderCell>                        
                        <Table.HeaderCell>Amount</Table.HeaderCell>                        
                        <Table.HeaderCell>Current Price (Today's Change)</Table.HeaderCell>
                        <Table.HeaderCell>Current Value</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {_.map(portfolio, (a, index) => 
                        <Table.Row key={index} positive={a.type.todayReturn && a.type.todayReturn >= 0} error={a.type.todayReturn && a.type.todayReturn < 0}>
                            <Table.Cell>{a.type.symbol}</Table.Cell>
                            <Table.Cell>{formatCurrency(((a.amount * (a.type.currPrice ? a.type.currPrice : 1)) / _.sumBy(portfolio, e => e.amount * (e.type.currPrice ? e.type.currPrice : 1))) * 100, { format: '%v%s', symbol: '%' })}</Table.Cell>
                            <Table.Cell>{a.type.symbol === 'USD' ? formatCurrency(a.amount, { format: '%s%v', symbol: '$' }) : a.amount}</Table.Cell>                            
                            <Table.Cell>{a.type.symbol === 'USD' ? '-' : `${formatCurrency(a.type.currPrice, { format: '%s%v', symbol: '$' })} (${a.type.todayReturn >= 0 ? '+' : ''}${formatCurrency(a.type.todayReturn, { format: '%v%s', symbol: '%' })})`}</Table.Cell>
                            <Table.Cell>{formatCurrency(a.amount * (a.type.currPrice ? a.type.currPrice : 1), { format: '%s%v', symbol: '$' })}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell><strong>TOTAL</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>100.00%</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>-</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>-</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>{formatCurrency(_.sumBy(portfolio, a => a.amount * (a.type.currPrice ? a.type.currPrice : 1)), { format: '%s%v', symbol: '$' })}</strong></Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}
