import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab, Button } from 'semantic-ui-react';
import { Navbar, Searchbar, GameOverview, GamePortfolio, GameCompare, GameRankings, GameSettings, TradeCard, JoinModal, GameTradingBots } from 'components';
import { GamePageStyle as styles, SharedStyle as sharedStyles } from 'styles'; 
import { GameMocks } from 'mocks';

export default class GamePage extends Component {
    constructor(props) {
        super(props);
        // TODO: get game from id: this.props.match.params.id
		this.state = {
            game: GameMocks.game1,
            thisPlayer: 0
        };
    }

  	render() {
        const { game, thisPlayer } = this.state;
        const { id, players, playerPortfolioPublic, isPrivate, completed } = game;

        // TODO: logic for getting userId
        const userId = '1';

        // TODO: logic for checking if player is in the game and if they are the host
        const inGame = true;
        const isHost = true;

        const GameOverviewPane = (
            <Tab.Pane key='tab1'>
                <GameOverview game={game} thisPlayer={thisPlayer} completed={completed} inGame={inGame} />
            </Tab.Pane>
        );
        const GameTradingBotsPane = !completed && inGame && (
            <Tab.Pane key='tab2'>
                <GameTradingBots gameId={id} player={players[thisPlayer]} />
            </Tab.Pane>
        );
        const GamePortfolioPane = inGame && (
            <Tab.Pane key='tab3'>
                <GamePortfolio player={players[thisPlayer]} completed={completed} />
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
                <GameSettings game={game} inGame={inGame} isHost={isHost} userId={userId} />
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
				<Navbar />
                {(completed || !inGame) ?
                [<div key='1' className={styles.completedHeader}>
                    <Header className={sharedStyles.inline} as='h1'>Game Name</Header>
                    {completed ?
                    <span className={styles.completedTag}>Completed</span>
                    :
                    <div className={styles.joinButton}>
                    <JoinModal size='tiny' isPrivate={isPrivate} gameId={id} userId={userId} />
                    </div>}
                </div>,
                <Tab key='2' className='thirteen wide column' panes={panes} renderActiveOnly={false} />]
                :
                [<Header key='1' as='h1'>Game Name</Header>,
                <div key='3' className='ui grid'>
                    <div className='three wide column'>
                        <TradeCard />
                    </div>
                    <Tab className='thirteen wide column' panes={panes} renderActiveOnly={false} />
                </div>]}
			</div>
		);
  	}
}
