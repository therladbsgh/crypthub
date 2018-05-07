import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Tab, Button, Grid, Loader, Dimmer } from 'semantic-ui-react';
import { GameBackend, UserBackend } from 'endpoints';
import { Navbar, Searchbar, GameOverview, GamePortfolio, GameCompare, GameRankings, GameSettings, TradeCard, JoinModal, GameTradingBots } from 'components';
import { GamePageStyle as styles, SharedStyle as sharedStyles } from 'styles'; 

class GamePage extends Component {
    constructor(props) {
        super(props);

		this.state = {
            game: {},
            thisPlayer: {},
            usernameUser: '',
            coins: [],
            users: [],
            hasMounted: false
        };

        this.updateGame = this.updateGame.bind(this);
    }

    componentWillMount() {
        const { match, history } = this.props;
        GameBackend.getGame(match.params.id)
		.then(resGame => {
            console.log('success! ', resGame);
            if (_.isEmpty(resGame.game)) return history.push('/gamenotfound');
            UserBackend.getUsername()
            .then(resUser => {
                console.log('success! ', resUser);
                GameBackend.getCoins()
                .then(resCoins => {
                    console.log('success! ', resCoins);
                    UserBackend.getAllUsers()
                    .then(resUsers => {
                        console.log('success! ', resUsers);
                        this.setState({
                            game: resGame.game,
                            thisPlayer: resGame.player,
                            usernameUser: resUser.username,
                            coins: resCoins.data,
                            users: resUsers.users,
                            hasMounted: true
                        });
                    }, ({ err }) => {
                        console.log('error! ', err);
                        history.push({ pathname: '/error', error: true });
                    });
                }, ({ err }) => {
                    console.log('error! ', err);
                    history.push({ pathname: '/error', error: true });
                });
            }, ({ err }) => {
                console.log('error! ', err);
                history.push({ pathname: '/error', error: true });
            });
		}, ({ err }) => {
			console.log('error! ', err);
			history.push({ pathname: '/error', error: true });
        });
    }
    
    updateGame(game) {
        const { thisPlayer } = this.state;
        this.setState({ game, thisPlayer: _.find(game.players, { _id: thisPlayer._id }) });
    }

  	render() {
        const { game, thisPlayer, usernameUser, coins, users, hasMounted } = this.state;
        const { id, name, players, playerPortfolioPublic, isPrivate, completed } = game;
        const { username } = thisPlayer;

        if (!hasMounted) return <Dimmer active><Loader size='massive'>Updating Game...</Loader></Dimmer>;

        const inGame = !_.isEmpty(thisPlayer);
        const isHost = game.host === username;

        const GameOverviewPane = (
            <Tab.Pane id={styles.tab} key='tab1'>
                <GameOverview game={game} thisPlayer={thisPlayer} completed={completed} inGame={inGame} />
            </Tab.Pane>
        );
        const GameTradingBotsPane = !completed && inGame && (
            <Tab.Pane id={styles.tab} key='tab2'>
                <GameTradingBots gameId={id} player={thisPlayer} />
            </Tab.Pane>
        );
        const GamePortfolioPane = inGame && (
            <Tab.Pane id={styles.tab} key='tab3'>
                <GamePortfolio gameId={id} player={thisPlayer} completed={completed} />
            </Tab.Pane>
        );
        const GameComparePane = playerPortfolioPublic && (
            <Tab.Pane id={styles.tab} key='tab4'>
                <GameCompare players={players} completed={completed} />
            </Tab.Pane>
        );
        const GameRankingsPane = (
            <Tab.Pane id={styles.tab} key='tab5'>
                <GameRankings players={players} />
            </Tab.Pane>
        );
        const GameSettingsPane = (
            <Tab.Pane id={styles.tab} key='tab6'>
                <GameSettings game={game} inGame={inGame} isHost={isHost} username={usernameUser} users={users} />
            </Tab.Pane>
        );

        const panes = [
            { menuItem: 'Overview', pane: GameOverviewPane },
            ...!completed && inGame ? [{ menuItem: 'Trading Bots', pane: GameTradingBotsPane }] : [],
            ...inGame ? [{ menuItem: 'Portfolio', pane: GamePortfolioPane }] : [],
            ...playerPortfolioPublic ? [{ menuItem: 'Compare', pane: GameComparePane }] : [],
            { menuItem: 'Rankings', pane: GameRankingsPane },
            { menuItem: 'Settings', pane: GameSettingsPane }
        ];

		return (
            hasMounted &&
			<div className={sharedStyles.containerNoMargin}>
				<Navbar username={usernameUser} />
                {(completed || !inGame) ?
                [<div key='1' className={`${styles.completedHeader} ${styles.header}`}>
                    <Header className={sharedStyles.inline} as='h1'>{name}</Header>
                    {completed ?
                    <span className={styles.completedTag}>Completed</span>
                    :
                    <div className={styles.joinButton}>
                        {usernameUser ?
                        <JoinModal size='tiny' isPrivate={isPrivate} gameId={id} />
                        :
                        <Button icon='user add' size='tiny' compact primary onClick={() => this.props.history.push({ pathname:'/login', redirected: true })} content='Join Game' />}
                    </div>}
                </div>,
                <Tab key='2' className='thirteen wide column' panes={panes} renderActiveOnly={false} />]
                :
                [<div key='1' className={styles.header}>
                    <Header as='h1'>{name}</Header>
                </div>,
                <Grid key='3'>
                    <Grid.Column width={3} id={styles.gridPadding}>
                        <TradeCard game={game} playerId={thisPlayer._id} coins={coins} updateGame={this.updateGame} />
                    </Grid.Column>
                    <Grid.Column width={13} id={styles.gridPadding}>
                        <Tab className='thirteen wide column' panes={panes} renderActiveOnly={false} />
                    </Grid.Column>
                </Grid>]}
			</div>
		);
  	}
}

export default withRouter(GamePage);
