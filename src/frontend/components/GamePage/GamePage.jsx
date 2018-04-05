import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar, Searchbar, TradeModal, GameOverview, GamePortfolio, GameRankings, GameSettings } from 'components';
import { GameMocks } from 'common';

// TODO: get coins
const source = [
    {
        name: 'Bitcoin',
        symbol: 'BTC',
        key: '1'
    },
    {
        name: 'Ethereum',
        symbol: 'ETH',
        key: '2'
    }
];

const resultRenderer = (coin) => (
    <div>
        {coin.name} - {coin.symbol}<br />
        <TradeModal coin={coin} />
    </div>
);

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

        const TradeHeader = (
            <div>
                <Header as='h2'>Search/Trade a Coin</Header>
                <Searchbar placeholder='Coin name or symbol' source={source} field='name' resultRenderer={resultRenderer} />
                <br />
            </div>
        );

        const GameOverviewPane = (
            <Tab.Pane key='tab1'>
                {TradeHeader}
                <GameOverview game={game} thisPlayer={thisPlayer} />
            </Tab.Pane>
        );
        const GamePortfolioPane = (
            <Tab.Pane key='tab2'>
                {TradeHeader}
                <GamePortfolio player={game.players[thisPlayer]} />
            </Tab.Pane>
        );
        const GameRankingsPane = (
            <Tab.Pane key='tab3'>
                {TradeHeader}
                <GameRankings players={game.players} />
            </Tab.Pane>
        );
        const GameSettingsPane = (
            <Tab.Pane key='tab4'>
                <GameSettings game={game} />
            </Tab.Pane>
        );

        const panes = [
            { menuItem: 'Overview', pane: GameOverviewPane },
            { menuItem: 'Portfolio', pane: GamePortfolioPane },
            { menuItem: 'Rankings', pane: GameRankingsPane },
            { menuItem: 'Settings', pane: GameSettingsPane }
        ];

		return (
			<div>
				<Navbar loggedIn={true} />
				<Header as='h1'>Game Name</Header>
				<Tab panes={panes} renderActiveOnly={false} />
			</div>
		);
  	}
}
