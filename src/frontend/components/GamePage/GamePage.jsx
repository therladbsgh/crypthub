import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Tab, Button } from 'semantic-ui-react';
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
            hasMounted: false
        };
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
                this.setState({
                    game: resGame.game,
                    thisPlayer: resGame.player,
                    usernameUser: resUser.username,
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

  	render() {
        const { game, thisPlayer, usernameUser, hasMounted } = this.state;
        const { id, name, players, playerPortfolioPublic, isPrivate, completed } = game;
        const { username } = thisPlayer;

        if (!hasMounted) return null;

        // TODO: logic for checking if player is in the game and if they are the host
        const inGame = !_.isEmpty(thisPlayer);
        const isHost = game.host === username;

        const GameOverviewPane = (
            <Tab.Pane key='tab1'>
                <GameOverview game={game} thisPlayer={thisPlayer} completed={completed} inGame={inGame} />
            </Tab.Pane>
        );
        const GameTradingBotsPane = !completed && inGame && (
            <Tab.Pane key='tab2'>
                <GameTradingBots gameId={id} player={thisPlayer} />
            </Tab.Pane>
        );
        const GamePortfolioPane = inGame && (
            <Tab.Pane key='tab3'>
                <GamePortfolio player={thisPlayer} completed={completed} />
            </Tab.Pane>
        );
        const GameComparePane = playerPortfolioPublic && (
            <Tab.Pane key='tab4'>
                <GameCompare players={players} completed={completed} />
            </Tab.Pane>
        );
        const GameRankingsPane = (
            <Tab.Pane key='tab5'>
                <GameRankings players={players} />
            </Tab.Pane>
        );
        const GameSettingsPane = (
            <Tab.Pane key='tab6'>
                <GameSettings game={game} inGame={inGame} isHost={isHost} username={username} />
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
			<div>
				<Navbar username={usernameUser} />
                {(completed || !inGame) ?
                [<div key='1' className={styles.completedHeader}>
                    <Header className={sharedStyles.inline} as='h1'>{name}</Header>
                    {completed ?
                    <span className={styles.completedTag}>Completed</span>
                    :
                    <div className={styles.joinButton}>
                        {username ?
                        <JoinModal size='tiny' isPrivate={isPrivate} gameId={id} username={username} />
                        :
                        <Button icon='user add' size='tiny' compact primary onClick={() => this.props.history.push('/login')} content='Join Game' />}
                    </div>}
                </div>,
                <Tab key='2' className='thirteen wide column' panes={panes} renderActiveOnly={false} />]
                :
                [<Header key='1' as='h1'>Game Name</Header>,
                <div key='3' className='ui grid'>
                    <div className='three wide column'>
                        <TradeCard game={game} playerId={thisPlayer._id} />
                    </div>
                    <Tab className='thirteen wide column' panes={panes} renderActiveOnly={false} />
                </div>]}
			</div>
		);
  	}
}

export default withRouter(GamePage);
