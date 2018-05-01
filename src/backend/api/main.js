function runBot(path, gameId, playerId, prices) {
    try {
        const bot = require(path);
        bot.api.setContext(gameId, playerId);

        // redirect to a log
        const log2 = console.log;
        console.log = function(...messages){log2(...messages)};

        bot.trade(prices);
    } catch (e) {
        console.log('[ERROR]', e.message);
    }
}

runBot('../../bots/users/user1/tradingbot1/tradingbot1.js', 'gameid', 'playerid', [2, 3, 4]);

module.exports = {
    runBot
};