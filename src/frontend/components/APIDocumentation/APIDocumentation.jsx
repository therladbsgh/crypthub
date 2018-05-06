import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Button, Icon, Container, Table, Divider } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { APIDocumentation as docs } from 'docs';
import { Navbar } from 'components'; 
import { APIDocumentationStyle as styles, SharedStyle as sharedStyles } from 'styles';

class APIDocumentation extends Component {
	constructor(props) {
		super(props);

		this.state = {
            username: '',
			hasMounted: false
		};
	}

	componentWillMount() {
		const { history } = this.props;
		UserBackend.getUsername()
		.then(res => {
			console.log('success! ', res);
            this.setState({ username: res.username, hasMounted: true });
		}, ({ err }) => {
			console.log('error! ', err);
			history.push({ pathname: '/error', error: true });
        });
	}

  	render() {
		const { username, hasMounted } = this.state;
		const methods = docs.methods;

		return (
			hasMounted &&
			<div className={sharedStyles.container}>
				<Navbar username={username} />
				<Container id={styles.container}>
					<div className={styles.note}>*Note that all of the following methods return a promise. This promise will either resolve to produce the result as described, or will reject an object that contains a 'message' parameter corresponding to the error that occurred.</div>
					{_.map(methods, (m, index) =>
						<div key={index}>
							<Header as='h1'>{m.name}</Header>
							<span>{m.description}</span>
							<Header as='h3'>Parameters</Header>
							{_.isEmpty(m.params) ?
							'None.'
							:
							<Table fixed>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>Name</Table.HeaderCell>
										<Table.HeaderCell>Type</Table.HeaderCell>
										<Table.HeaderCell>Description</Table.HeaderCell>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{_.map(m.params, (p, index) => 
										<Table.Row key={index}>
											<Table.Cell>
												{p.name}
											</Table.Cell>
											<Table.Cell>
												{p.type}
											</Table.Cell>
											<Table.Cell>
												{p.description}
											</Table.Cell>
										</Table.Row>
									)}
								</Table.Body>
							</Table>}
							<Header as='h3'>Return - {m.return.type}</Header>
							<span>{m.return.description}</span>
							{index < methods.length - 1 && <Divider id={styles.divider} section />}
						</div>
					)}
				</Container>
			</div>
		);
  	}
}

export default withRouter(APIDocumentation);
