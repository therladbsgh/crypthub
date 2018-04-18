import date from 'date-and-time';

export const player1 = {
    name: 'player1',
    id: '1',
    portfolio: [
        {
            type: {
                name: 'Bitcoin',
                symbol: 'BTC',
                currPrice: 10000,
                todayReturn: 3.25
            },
            amount: 250
        },
        {
            type: {
                name: 'Ethereum',
                symbol: 'ETH',
                currPrice: 5000,
                todayReturn: -20.01
            },
            amount: 1000.28373623
        },
        {
            type: {
                name: 'US Dollars',
                symbol: 'USD',
                currPrice: null,
                todayReturn: null
            },
            amount: 1000000
        }
    ],
    transactions: {
        history: [
            {
                id: '1',
                type: 'market',
                side: 'buy',
                size: 25,
                price: 100,
                symbol: 'BTC',
                date: date.parse('Apr 1 2018', 'MMM D YYYY'),
                GTC: true,
                expiration: null,
                filled: true,
                filledDate: date.parse('Apr 3 2018', 'MMM D YYYY')
            },
            {
                id: '2',
                type: 'limit',
                side: 'buy',
                size: 35.000006,
                price: 200,
                symbol: 'ETH',
                date: date.parse('Apr 2 2018', 'MMM D YYYY'),
                GTC: false,
                expiration: date.parse('Apr 5 2018', 'MMM D YYYY'),
                filled: false,
                filledDate: null
            }
        ],
        current: [
            {
                id: '3',
                type: 'short',
                side: 'sell',
                size: 80,
                price: 100,
                symbol: 'BTC',
                date: date.parse('Apr 2 2018', 'MMM D YYYY'),
                GTC: true,
                expiration: null,
                filled: false,
                filledDate: null
            },
            {
                id: '4',
                type: 'limit',
                side: 'buy',
                size: 2,
                price: 200,
                symbol: 'ETH',
                date: date.parse('Apr 7 2018', 'MMM D YYYY'),
                GTC: false,
                expiration: date.parse('May 2 2018', 'MMM D YYYY'),
                filled: false,
                filledDate: null
            }
        ]
    },
    netWorth: 200,
    numTrades: 80,
    netReturn: -20,
    todayReturn: 5,
    currRank: 2,
    buyingPower: 150,
    shortReserve: 50,
    tradingBots: [
        {
            id: 'bot1',
            name: 'tradingbot1'
        },
        {
            id: 'bot2',
            name: 'tradingbot2'
        }
    ],
    activeBotId: 'bot1'
};

export const player2 = {
    name: 'player2',
    id: '2',
    portfolio: [
        {
            type: {
                name: 'Bitcoin',
                symbol: 'BTC',
                currPrice: 10000,
                todayReturn: 3.25
            },
            amount: 200.425
        },
        {
            type: {
                name: 'Ethereum',
                symbol: 'ETH',
                currPrice: 5000,
                todayReturn: -20.01
            },
            amount: 780.00000002
        },
        {
            type: {
                name: 'US Dollars',
                symbol: 'USD',
                currPrice: null,
                todayReturn: null
            },
            amount: 1200000
        }
    ],
    transactions: {
        history: [
            {
                id: '5',
                side: 'buy',
                size: 1,
                price: 10,
                symbol: 'ETH'
            },
            {
                id: '6',
                side: 'sell',
                size: 3500,
                price: 202220,
                symbol: 'ETH'
            }
        ],
        current: [
            {
                id: '7',
                side: 'sell',
                size: 23230,
                price: 232,
                symbol: 'BTC'
            },
            {
                id: '8',
                side: 'buy',
                size: 6000,
                price: 50,
                symbol: 'ETH'
            }
        ]
    },
    netWorth: 300,
    numTrades: 2,
    netReturn: 120
};
