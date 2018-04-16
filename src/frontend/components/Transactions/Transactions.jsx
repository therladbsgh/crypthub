import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import date from 'date-and-time';
import { Table } from 'semantic-ui-react';

date.subtractStr = (date1, date2) => {
	const subtract = date.subtract(date1, date2);
	let val = 0;
	let str = 'milliseconds';
	if (subtract.toDays() > 0) {
		val = subtract.toDays();
		str = 'days';
	} else if (subtract.toHours() > 0) {
		val = subtract.toHours();
		str = 'hours';
	} else if (subtract.toMinutes() > 0) {
		val = subtract.toMinutes();
		str = 'minutes';
	} else if (subtract.toSeconds() > 0) {
		val = subtract.toSeconds();
		str = 'seconds';
	} else {
		val = subtract.toMilliseconds();
	}
	
	str = `${val} ${str}`;
	return val === 1 ? _.slice(str, 0, -1) : str;
};

export default class Transactions extends Component {
    render() {
        const { transactions } = this.props;
        const now = new Date();

        return (
			<Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Placed</Table.HeaderCell>                        
                        <Table.HeaderCell>Coin</Table.HeaderCell>                        
                        <Table.HeaderCell>Size</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {_.map(transactions, (t, index) => 
                        <Table.Row key={index} positive={t.filled} error={!t.filled && t.expiration && t.expiration <= now}>
                            <Table.Cell>{_.capitalize(`${t.type} ${t.side}`)}</Table.Cell>
                            <Table.Cell>{date.format(t.date, 'MM/DD/YYYY')}</Table.Cell>
                            <Table.Cell>{t.symbol}</Table.Cell>                            
                            <Table.Cell>{t.size}</Table.Cell>
                            <Table.Cell>{formatCurrency(t.price, { format: '%s%v', symbol: '$' })}</Table.Cell>
                            <Table.Cell>{t.filled ? `Filled ${date.format(t.filledDate, 'MM/DD/YYYY')}` : t.GTC ? 'GTC' : t.expiration && t.expiration <= now ? `Expired ${date.format(t.expiration, 'MM/DD/YYYY')}` : `Expires in ${date.subtractStr(t.expiration, now)}`}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}
