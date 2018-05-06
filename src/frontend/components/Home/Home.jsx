import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Button, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components'; 
import { HomeStyle as styles, SharedStyle as sharedStyles } from 'styles';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasMounted: false
		};
	}

	componentWillMount() {
		const { history } = this.props;
		UserBackend.getUsername()
		.then(res => {
			console.log('success! ', res);
            if (_.isEmpty(res)) {
				this.setState({ hasMounted: true });
			} else {
				history.push('/games');
			}
		}, ({ err }) => {
			console.log('error! ', err);
			history.push({ pathname: '/error', error: true });
        });
	}

  	render() {
		return (
			this.state.hasMounted &&
			<div className={styles.container}>
				<Navbar username={''} />
				<div className={styles.main}>
					<span id={styles.preText}>Virtual Cryptocurrency Trading Game</span>
					<Header as='h1' id={styles.headerText}>Trade Coins. Make Profits.<br />Write the Smartest Trading Bot.</Header>
					<span id={styles.blurbText}>Build intelligent trading programs that operate on realtime data. Compete against friends and hackers to earn your spot at the top of the leaderboards.</span>
					<Button positive as={Link} to={{ pathname: '/login', openTab: 2 }} size='massive' content='Create Game' />
					<Button primary as={Link} to={{ pathname: '/login', openTab: 1 }} size='massive' content='Find Game' />
				</div>
			</div>
		);
  	}
}

export default withRouter(Home);
