export const player1 = {
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
    netReturn: -20
};

export const player2 = {
    name: 'player2',
    portfolio: [
        {
            name: 'Bitcoin',
            amount: 300
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
