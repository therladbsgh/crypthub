import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar, Searchbar, GameOverview, GamePortfolio, GameCompare, GameRankings, GameSettings, TradeCard } from 'components';
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

        const GameOverviewPane = (
            <Tab.Pane key='tab1'>
                <GameOverview game={game} thisPlayer={thisPlayer} />
            </Tab.Pane>
        );
        const GamePortfolioPane = (
            <Tab.Pane key='tab2'>
                <GamePortfolio player={game.players[thisPlayer]} />
            </Tab.Pane>
        );
        const GameComparePane = (
            <Tab.Pane key='tab3'>
                <GameCompare players={game.players} />
            </Tab.Pane>
        );
        const GameRankingsPane = (
            <Tab.Pane key='tab4'>
                <GameRankings players={game.players} />
            </Tab.Pane>
        );
        const GameSettingsPane = (
            <Tab.Pane key='tab5'>
                <GameSettings game={game} />
            </Tab.Pane>
        );

        const panes = [
            { menuItem: 'Overview', pane: GameOverviewPane },
            { menuItem: 'Portfolio', pane: GamePortfolioPane },
            { menuItem: 'Compare', pane: GameComparePane },
            { menuItem: 'Rankings', pane: GameRankingsPane },
            { menuItem: 'Settings', pane: GameSettingsPane }
        ];

		return (
			<div>
				<Navbar />
				<Header as='h1'>Game Name</Header>
                <div className='ui grid'>
                    <div className='three wide column'>
                        <TradeCard />
                    </div>
                    <Tab className='thirteen wide column' panes={panes} renderActiveOnly={false} />
                </div>
			</div>
		);
  	}
}
