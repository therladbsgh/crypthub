import * as _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from 'format-currency';
import date from 'date-and-time';
import { Header, Table, Icon } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { SharedStyle as sharedStyles } from 'styles';

export default class YourGames extends Component {
    render() {
        const { games } = this.props;
        
        return (
			<div>
				<Header as='h2'>Your Games</Header>
				<Table celled>
                    <Table.Header>
                        <Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>		
                            <Table.HeaderCell>Today's Return</Table.HeaderCell>							
                            <Table.HeaderCell>Net Return</Table.HeaderCell>												
                            <Table.HeaderCell><Icon name='trophy' /></Table.HeaderCell>
                            <Table.HeaderCell>End</Table.HeaderCell>
                            <Table.HeaderCell>Number of Players</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {_.map(games, (g, index) => {
                                // TODO: get correct player
                                const p = g.players[0];
                                return (
                                <Table.Row key={index}>
                                    <Table.Cell><Link to={`/game/${g.id}`}>{g.name}</Link></Table.Cell>
                                    <Table.Cell className={g.completed ? '' : p.todayReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{g.completed ? '-' : `${p.todayReturn >= 0 ? '+' : ''}${formatCurrency(p.todayReturn, { format: '%v%s', symbol: '%' })}`}</Table.Cell>
                                    <Table.Cell className={p.netReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{formatCurrency(Math.abs(p.netReturn), { format: '%s%v', symbol: `${p.netReturn >= 0 ? '+' : '-'}$` })}</Table.Cell>
                                    <Table.Cell>{p.currRank}</Table.Cell>
                                    <Table.Cell>{date.format(g.end, 'MM/DD/YYYY')}</Table.Cell>
                                    <Table.Cell>{g.players.length}</Table.Cell>
                                </Table.Row>);
                            }
                        )}
                    </Table.Body>
                </Table>
			</div>
        );
    }
}
