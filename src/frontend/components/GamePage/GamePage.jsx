import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar, Searchbar } from 'components';
import { TradeModal, GameOverview, GamePortfolio, GameRankings, GameSettings } from 'components';

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
            game: {
                name: 'game1',
                description: 'desc1',
                host: 'user1',
                created: '1 sec ago',
                startOn: '04/03/18',
                endIn: '20 hours',
                numPlayers: '2',
                players: [
                    {
                        name: 'player1',
                        portfolio: [
                            {
                                name: 'Bitcoin',
                                amount: 250
                            }
                        ],
                        transactions: {
                            history: [
                                {
                                    id: '1',
                                    side: 'buy',
                                    size: 25,
                                    price: 100,
                                    symbol: 'BTC'
                                },
                                {
                                    id: '2',
                                    side: 'buy',
                                    size: 35,
                                    price: 200,
                                    symbol: 'ETH'
                                }
                            ],
                            current: [
                                {
                                    id: '3',
                                    side: 'sell',
                                    size: 80,
                                    price: 100,
                                    symbol: 'BTC'
                                },
                                {
                                    id: '4',
                                    side: 'buy',
                                    size: 2,
                                    price: 200,
                                    symbol: 'ETH'
                                }
                            ]
                        },
                        netWorth: 200,
                        numTrades: 80,
                        netReturn: 20
                    },
                    {
                        name: 'player2',
                        portfolio: [
                            {
                                name: 'Bitcoin',
                                amount: 300
                            }
                        ],
                        transactions: [
                            {
                                id: '1',
                                side: 'sell',
                                size: 20,
                                price: 200,
                                symbol: 'BTC'
                            }
                        ],
                        netWorth: 300,
                        numTrades: 2,
                        netReturn: 120
                    }
                ]
            },
            thisPlayer: 0
        };

        this.noEvent = this.noEvent.bind(this);
    }
    
    noEvent(event) {
        event.preventDefault();
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
