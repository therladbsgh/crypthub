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
    _id: String,
    username: String,
    netWorth: Number,
    numTrades: Number,
    netReturn: Number,
    todayReturn: Number,
    currRank: Number,
    buyingPower: Number,
    shortReserve: Number,
    portfolio: Array.of.AssetType,
    transactionCurrent: Array.of.TradeType,
    transactionHistory: Array.of.TradeType,
    tradingBots: Array.of.TradingBotType,
    activeBotId: String,
    activeBotLog: String
};

const AssetType = {
    coin: CoinType,
    amount: Number
};

const TradeType = {
    _id: String,
    type: 'market' | 'limit' | 'short' | 'stop',
    side: 'buy' | 'sell',
    size: Number,
    price: Number,
    coin: CoinType,
    date: Date,
    GTC: Boolean,
    expiration: Date,
    filled: Boolean,
    filledDate: Date
};

const CoinType = {
    name: 'Bitcoin' | 'Ethereum' | 'US Dollars',
    symbol: 'BTC' | 'ETH' | 'USD',
    currPrice: Number,
    todayReturn: Number
};

const UserType = {
    username: String,
    ELO: Number,
    games: Array.of.GameType,
    tradingBots: Array.of.TradingBotType
};

const TradingBotType = {
    _id: String,
    name: String,
    data: String,
    log: String
};
