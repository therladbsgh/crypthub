import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import date from 'date-and-time';
import { Header, Table, Icon } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { GameMocks } from 'mocks';
import { SharedStyle as sharedStyles } from 'styles';

// TODO: get games
const games = [
	GameMocks.game1,
	GameMocks.game2,
	GameMocks.game3
];

// TODO: get games
const pastGames = [
	GameMocks.game1,
	GameMocks.game2,
	GameMocks.game3
];

export default class YourGames extends Component {
    render() {
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
                                    <Table.Cell>{g.name}</Table.Cell>
                                    <Table.Cell className={g.completed ? '' : p.todayReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{g.completed ? '-' : formatCurrency(p.todayReturn, { format: '%v%s', symbol: '%' })}</Table.Cell>
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
