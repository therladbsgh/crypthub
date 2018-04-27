import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import date from 'date-and-time';
import { Table, Button } from 'semantic-ui-react';
import { CancelModal } from 'components';
import { TransactionsStyle as styles } from 'styles';

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
        const { transactions, current } = this.props;
        const now = new Date(); 

        return (
            _.isEmpty(transactions) ?
            <div>
                <br />
                {current ? 'You have no current trade orders.' : 'None of your trades have completed yet.'}
            </div>
            :
			<Table celled definition={current}>
                <Table.Header>
                    <Table.Row>
                        {current && <Table.HeaderCell />}
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Placed</Table.HeaderCell>
                        <Table.HeaderCell>Coin</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {_.map(transactions, (t, index) => 
                        <Table.Row key={index} positive={t.filled} error={!current && !t.filled && t.expiration <= now}>
                            {current && <Table.Cell id={styles.cancel}><CancelModal tradeId={t._id} /></Table.Cell>}
                            <Table.Cell>{_.capitalize(`${t.type} ${t.side}`)}</Table.Cell>
                            <Table.Cell>{date.format(new Date(t.date), 'MM/DD/YYYY HH:mm:ss')}</Table.Cell>
                            <Table.Cell>{t.coin.symbol}</Table.Cell>
                            <Table.Cell>{t.size}</Table.Cell>
                            <Table.Cell>{formatCurrency(t.price, { format: '%s%v', symbol: '$' })}</Table.Cell>
                            <Table.Cell>{current ? t.GTC ? 'GTC' : `Expires in ${date.subtractStr(new Date(t.expiration), now)}` : t.filled ? `Filled ${date.format(new Date(t.filledDate), 'MM/DD/YYYY HH:mm:ss')}` : `Expired ${date.format(new Date(t.expiration), 'MM/DD/YYYY HH:mm:ss')}`}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}
