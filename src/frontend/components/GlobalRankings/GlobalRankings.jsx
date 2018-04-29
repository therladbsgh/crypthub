import * as _ from 'lodash';
import React, { Component } from 'react';
import { Container, Header, Table, Icon, Form } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar, Searchbar } from 'components';
import { GlobalRankingsStyle as styles, SharedStyle as sharedStyles } from 'styles';
import { UserMocks } from 'mocks';

//TODO: get users
const users = [
    UserMocks.user1,
    UserMocks.user2,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
    UserMocks.user1,
];

export default class GlobalRankings extends Component {
    constructor(props) {
		super(props);
		this.state = {
            username: '',
            results: ['RESET'],
            hasMounted: false
		};

		this.handleResults = this.handleResults.bind(this);
    }
    
    componentWillMount() {
		UserBackend.getUsername()
		.then(res => {
			console.log('success! ', res);
            this.setState({ username: res.username, hasMounted: true });
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
	}

	handleResults(results) {
		this.setState({ results });
    }
    
    render() {
        const { username, results, hasMounted } = this.state;

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
                    {!_.isEmpty(results) ?
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
                                    (_.some(results, _.mapKeys(_.mapValues(u, v => String(v)), (v, k) => k.toLowerCase())) || results[0] === 'RESET') && 
                                        <Table.Row key={index}>
                                            <Table.Cell>{index + 1}</Table.Cell>
                                            <Table.Cell>{u.name}</Table.Cell>
                                            <Table.Cell>{u.ELO}</Table.Cell>
                                        </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                        :
                        <Header as='h3'>No users found</Header>
                    }
                </Container>
            </div>
        );
    }
}
