import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components'; 
import { PageNotFoundStyle as styles, SharedStyle as sharedStyles } from 'styles';

export default class PageNotFound extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errMsg: this.props.location.error ? 'Error 500: An unknown error has occurred. Please try again later.' : 'Error 404: Page not found',
			username: '',
			hasMounted: false
		};
	}

	componentWillMount() {
		const { history } = this.props;
		UserBackend.getUsername()
		.then(res => {
			console.log('success! ', res);
            this.setState({
				username: res.username,
				hasMounted: true
			});
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({
				errMsg: 'Error 500: An unknown error has occurred. Please try again later.',
				hasMounted: true
			});
        });
	}

  	render() {
		const { errMsg, username, hasMounted } = this.state;

		return (
			hasMounted &&
			<div className={sharedStyles.container}>
				<Navbar username={username} />
				<div className={styles.main}>
					<Header as='h1'>{errMsg}</Header>
				</div>
			</div>
		);
  	}
}
