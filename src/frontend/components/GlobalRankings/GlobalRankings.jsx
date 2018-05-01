import * as _ from 'lodash';
import React, { Component } from 'react';
import { Container, Header, Table, Icon, Form, Pagination } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar, Searchbar } from 'components';
import { GlobalRankingsStyle as styles, SharedStyle as sharedStyles } from 'styles';

const numPerPage = 10;

export default class GlobalRankings extends Component {
    constructor(props) {
		super(props);
		this.state = {
            username: '',
            users: [],
            results: ['RESET'],
            activePage: 1,
            hasMounted: false
        };

		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleResults = this.handleResults.bind(this);
    }
    
    componentWillMount() {
		UserBackend.getUsername()
		.then(resUsername => {
			console.log('success! ', resUsername);
            UserBackend.getAllUsers()
            .then(resUsers => {
                console.log('success! ', resUsers);
                this.setState({
                    username: resUsername.username,
                    users: _.map(resUsers.users, (u, index) => _.extend({}, u, { rank: index + 1 })),
                    hasMounted: true
                });
            }, ({ err }) => {
                console.log('error! ', err);
                alert(`Error: ${err}`);
            });
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
    }
    
    handlePageChange(event, { activePage }) {
		this.setState({ activePage });
	}

	handleResults(results) {
		this.setState({
			results,
			activePage: 1
		});
    }
    
    render() {
        const { username, users, results, activePage, hasMounted } = this.state;

        const resultUsers = results[0] === 'RESET' ? users : _.filter(users, u => _.some(results, _.mapKeys(_.mapValues(u, v => String(v)), (v, k) => k.toLowerCase())));
        const upper = activePage * numPerPage;
		const usersShown = _.slice(resultUsers, (activePage - 1) * numPerPage, upper > resultUsers.length ? resultUsers.length : upper);

        const totalPages = Math.ceil((results[0] === 'RESET' ? users.length : results.length) / numPerPage);

        // User's keys need to be lowercase to work with searchbar results
        return (
            hasMounted &&
            <div className={sharedStyles.container}>
                <Navbar username={username} />
                <Container id={styles.container}>
                    <Header as='h1' textAlign='center'>Global Rankings</Header>
                    <Form>
                        <Form.Field width={8}>
                            <label>Search for a User</label>
                            <Searchbar placeholder='Username' source={users} field='name' searchFields={['name']} handleResults={this.handleResults} open={false} />                
                        </Form.Field>
                    </Form>
                    {!_.isEmpty(usersShown) ?
                        [<Table key='1' celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell><Icon name='trophy' /></Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>ELO</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {_.map(usersShown, (u, index) =>
                                    <Table.Row key={index}>
                                        <Table.Cell>{u.rank}</Table.Cell>
                                        <Table.Cell>{u.name}</Table.Cell>
                                        <Table.Cell>{u.ELO}</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>,
                        totalPages > 1 && 
                        <div key='2' className={sharedStyles.center}>
					        <Pagination totalPages={totalPages} activePage={activePage} onPageChange={this.handlePageChange} />
                        </div>]
                        :
                        <Header as='h3'>No users found</Header>
                    }
                </Container>
            </div>
        );
    }
}
