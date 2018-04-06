// For reference purposes. Always note that this file was updated in commit messages if necessary.

const GameType = {
    id: String,
    name: String,
    description: String,
    host: String,
    created: Date,
    start: Date,
    end: Date,
    numPlayers: Number,
    players: Array.of.PlayerType
};

const PlayerType = {
    name: String,
    netWorth: Number,
    numTrades: Number,
    netReturn: Number,
    portfolio: Array.of.AssetType,
    transactions: {
        history: Array.of.TradeType,
        current: Array.of.TradeType
    }
};

const AssetType = {
    name: String,
    amount: Number
};

const TradeType = {
    id: String,
    side: String,
    size: Number,
    price: Number,
    symbol: String
};

const CoinType = {
    name: String,
    symbol: String
};
