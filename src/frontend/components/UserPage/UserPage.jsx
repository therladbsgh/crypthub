import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Tab, Loader, Dimmer } from 'semantic-ui-react';
import { UserBackend, GameBackend } from 'endpoints';
import { Navbar } from 'components';
import { YourGames, FindGames, CreateGame, UserTradingBots } from 'components';
import { UserPageStyle as styles, SharedStyle as sharedStyles } from 'styles';

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
                    history.push({ pathname: '/error', error: true });
                });
			}
		}, ({ err }) => {
			console.log('error! ', err);
			history.push({ pathname: '/error', error: true });
        });
	}
    
  	render() {
        const { user, allGames, hasMounted } = this.state;
        const { username, ELO, games, tradingBots } = user;

        if (!hasMounted) return <Dimmer active><Loader size='massive'>Loading User Page...</Loader></Dimmer>;

        const YourGamesPane = (
            <Tab.Pane id={styles.tab} key='tab1'>
                <YourGames games={games} username={username} ELO={ELO} />
            </Tab.Pane>
        );
        const FindGamesPane = (
            <Tab.Pane id={styles.tab} key='tab2'>
                <FindGames games={allGames} />
            </Tab.Pane>
        );
        const CreateGamePane = (
            <Tab.Pane id={styles.tab} key='tab3'>
                <CreateGame />
            </Tab.Pane>
        );
        const TradingBotsPane = (
            <Tab.Pane id={styles.tab} key='tab4'>
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
			<div className={sharedStyles.containerNoMargin}>
				<Navbar username={username} />
                <div className={styles.header}>
                    <p className={styles.welcome}>Welcome back</p>
                    <Header id={styles.username} as='h1'>{username}</Header>
                </div>
				<Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={propsState ? propsState.openTab : 0} />
			</div>
		);
  	}
}

export default withRouter(UserPage);
