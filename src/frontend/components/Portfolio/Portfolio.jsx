import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import date from 'date-and-time';
import { Table } from 'semantic-ui-react';

export default class Portfolio extends Component {
    render() {
        const { portfolio, header, completed } = this.props;

        return (
			<Table celled>
                <Table.Header>
                    {header && 
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>{header}</Table.HeaderCell>
                    </Table.Row>}
                    <Table.Row>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>% of Holdings</Table.HeaderCell>                        
                        <Table.HeaderCell>Amount</Table.HeaderCell>                        
                        <Table.HeaderCell>{completed ? 'Final Price (Final Day\'s Change)' : 'Current Price (Today\'s Change)'}</Table.HeaderCell>
                        <Table.HeaderCell>Current Value</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {_.map(portfolio, (a, index) => {
                        const { coin } = a;
                        return (
                            <Table.Row key={index} positive={coin.todayReturn && coin.todayReturn >= 0} error={coin.todayReturn && coin.todayReturn < 0}>
                                <Table.Cell>{coin.symbol}</Table.Cell>
                                <Table.Cell>{formatCurrency(((a.amount * (coin.currPrice ? coin.currPrice : 1)) / _.sumBy(portfolio, e => e.amount * (e.coin.currPrice ? e.coin.currPrice : 1))) * 100, { format: '%v%s', symbol: '%' })}</Table.Cell>
                                <Table.Cell>{coin.symbol === 'USD' ? formatCurrency(a.amount, { format: '%s%v', symbol: '$' }) : a.amount}</Table.Cell>                            
                                <Table.Cell>{coin.symbol === 'USD' ? '-' : `${formatCurrency(coin.currPrice, { format: '%s%v', symbol: '$' })} (${coin.todayReturn >= 0 ? '+' : ''}${formatCurrency(coin.todayReturn, { format: '%v%s', symbol: '%' })})`}</Table.Cell>
                                <Table.Cell>{formatCurrency(a.amount * (coin.currPrice ? coin.currPrice : 1), { format: '%s%v', symbol: '$' })}</Table.Cell>
                            </Table.Row>
                    );})}
                </Table.Body>

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell><strong>TOTAL</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>100.00%</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>-</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>-</strong></Table.HeaderCell>
                        <Table.HeaderCell><strong>{formatCurrency(_.sumBy(portfolio, a => a.amount * (a.coin.currPrice ? a.coin.currPrice : 1)), { format: '%s%v', symbol: '$' })}</strong></Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}
