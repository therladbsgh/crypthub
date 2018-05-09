const bot = require('./file.js');

const ids = process.argv[2].split('*');
bot.api.setContext(ids[0], ids[1]);

process.stdin.on('data', function(data) {
	bot.trade(JSON.parse(String(data)));
});
