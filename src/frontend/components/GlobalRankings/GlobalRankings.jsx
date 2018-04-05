import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Table, Icon } from 'semantic-ui-react';
import { Navbar } from 'components';

//TODO: get users
const users = [
    {
        name: 'user1',
        ELO: '3000',
    },
    {
        name: 'user2',
        ELO: '2000',
    }
];

export default class GlobalRankings extends Component {
    render() {
        return (
            <div>
                <Navbar loggedIn={false} />
                <Header as='h2'>Global Rankings</Header>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell><Icon name='trophy' /></Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>ELO</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {_.map(users, (u, index) => 
                            <Table.Row key={index}>
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>{u.name}</Table.Cell>
                                <Table.Cell>{u.ELO}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
