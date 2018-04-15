// For reference purposes. Always note that this file was updated in commit messages if necessary.

const GameType = {
    id: String,
    name: String,
    description: String,
    host: String,
    created: Date,
    start: Date,
    end: Date,
    playerPortfolioPublic: Boolean,
    startingBalance: Number,
    commissionValue: Number,
    shortSelling: Boolean,
    limitOrders: Boolean,
    stopOrders: Boolean,
    lastUpdated: Date,
    completed: Boolean,
    players: Array.of.PlayerType,
    isPrivate: Boolean,
    password: String
};

const PlayerType = {
    id: String,
    userId: String,
    name: String,
    netWorth: Number,
    numTrades: Number,
    netReturn: Number,
    todayReturn: Number,
    currRank: Number,
    buyingPower: Number,
    shortReserve: Number,
    portfolio: Array.of.AssetType,
    transactions: {
        history: Array.of.TradeType,
        current: Array.of.TradeType
    }
};

const AssetType = {
    name: CoinType,
    amount: Number
};

const TradeType = {
    id: String,
    type: String,
    side: String,
    size: Number,
    price: Number,
    symbol: String,
    date: Date,
    GTC: Boolean,
    filled: Boolean
};

const CoinType = {
    name: String,
    symbol: String,
    currPrice: Number
};

const UserType = {
    id: String,
    name: String,
    ELO: Number,
    games: Array.of.GameType,
};
