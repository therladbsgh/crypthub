import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { UserBackend, GameBackend } from 'endpoints';
import { Navbar } from 'components';
import { YourGames, FindGames, CreateGame, UserTradingBots } from 'components';
import { UserPageStyle as styles } from 'styles';

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            allGames: [],
            hasMounted: false
        };
    }

    componentWillMount() {
		const { history } = this.props;
		UserBackend.getUser()
		.then(resUser => {
			console.log('success! ', resUser);
            if (_.isEmpty(resUser)) {
                history.push('/login');
			} else {
                GameBackend.getAllGames()
                .then(resGames => {
                    console.log('success! ', resGames);
                    this.setState({ user: resUser.user, allGames: resGames.games, hasMounted: true });
                }, ({ err }) => {
                    console.log('error! ', err);
                    alert(`Error: ${err}`);
                });
			}
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
	}
    
  	render() {
        const { user, allGames, hasMounted } = this.state;
        const { username, games, tradingBots } = user;

        const YourGamesPane = (
            <Tab.Pane key='tab1'>
                <YourGames games={games} username={username} />
            </Tab.Pane>
        );
        const FindGamesPane = (
            <Tab.Pane key='tab2'>
                <FindGames games={allGames} />
            </Tab.Pane>
        );
        const CreateGamePane = (
            <Tab.Pane key='tab3'>
                <CreateGame />
            </Tab.Pane>
        );
        const TradingBotsPane = (
            <Tab.Pane key='tab4'>
                <UserTradingBots tradingBots={tradingBots} />
            </Tab.Pane>
        );

        const panes = [
            { menuItem: 'Your Games', pane: YourGamesPane },
            { menuItem: 'Find Games', pane: FindGamesPane },
            { menuItem: 'Create Game', pane: CreateGamePane },
            { menuItem: 'Trading Bots', pane: TradingBotsPane }
        ];

        const propsState = this.props.location.state;

		return (
            hasMounted &&
			<div>
				<Navbar username={username} />
                <p className={styles.welcome}>Welcome back,</p>
				<Header id={styles.username} as='h1'>{username}</Header>
				<Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={propsState ? propsState.openTab : 0} />
			</div>
		);
  	}
}

export default withRouter(UserPage);
