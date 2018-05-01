function runBot(path, gameId, playerId, prices) {
    try {
        const bot = require(path);
        bot.api.setContext(gameId, playerId);
        bot.trade(prices);
    } catch (e) {
        console.log('[ERROR]', e.message);
    }
}

runBot('../../bots/users/user1/tradingbot1/tradingbot1.js', 'gameid', 'playerid', []);

module.exports = {
    runBot
};