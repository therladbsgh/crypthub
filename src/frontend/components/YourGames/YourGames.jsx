import * as _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from 'format-currency';
import date from 'date-and-time';
import { Header, Table, Icon, Statistic, Pagination } from 'semantic-ui-react';
import { Searchbar, GameCard } from 'components';
import { SharedStyle as sharedStyles } from 'styles';

const numPerPage = 10;

export default class YourGames extends Component {
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
        const { games, username, ELO } = this.props;
        const { activePage } = this.state;

        const upper = activePage * numPerPage;
		const gamesShown = _.slice(games, (activePage - 1) * numPerPage, upper > games.length ? games.length : upper);

        return (
            _.isEmpty(games) ?
            'You have no games, go join or create a game!'
            :
			<div>
                <div className={sharedStyles.center}>
                    <Statistic>
                        <Statistic.Label>Your Current ELO</Statistic.Label>
                        <Statistic.Value>{ELO}</Statistic.Value>
                    </Statistic>
                </div>
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
                        {_.map(gamesShown, (g, index) => {
                                const p = _.find(g.players, { username });
                                return (
                                <Table.Row key={index}>
                                    <Table.Cell><Link to={`/game/${g.id}`}>{g.name}</Link></Table.Cell>
                                    <Table.Cell className={g.completed ? '' : p.todayReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{g.completed ? '-' : `${p.todayReturn >= 0 ? '+' : ''}${formatCurrency(p.todayReturn, { format: '%v%s', symbol: '%' })}`}</Table.Cell>
                                    <Table.Cell className={p.netReturn >= 0 ? sharedStyles.pos : sharedStyles.neg}>{formatCurrency(Math.abs(p.netReturn), { format: '%s%v', symbol: `${p.netReturn >= 0 ? '+' : '-'}$` })}</Table.Cell>
                                    <Table.Cell>{p.currRank}</Table.Cell>
                                    <Table.Cell>{date.format(new Date(g.end), 'MM/DD/YYYY')}</Table.Cell>
                                    <Table.Cell>{g.players.length}</Table.Cell>
                                </Table.Row>);
                            }
                        )}
                    </Table.Body>
                </Table>
                <div className={sharedStyles.center}>
					<Pagination totalPages={Math.ceil(games.length / numPerPage)} activePage={activePage} onPageChange={this.handlePageChange} />
				</div>
			</div>
        );
    }
}
