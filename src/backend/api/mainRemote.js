const fs = require('fs');
const util = require('util');
const axios = require('axios');

function runBot(botPath, logPath, gameId, playerId, prices) {
    const logFile = fs.createWriteStream(logPath, { flags: 'a' });
    return new Promise((resolve, reject) => {
        axios.post('http://ec2-52-205-237-224.compute-1.amazonaws.com:8080/compile', {
            language: 4,
            code: "const api = require('./api.js');function trade(prices) {console.log('testing', prices[0]);api.test();} module.exports = {api,trade};",
            stdin: JSON.stringify([{ symbol: 'BTC', price: 100}, { symbol: 'ETH', price: 200}]),
            additional: gameId + '*' + playerId
        })
        .then(res => {
            const { status, data } = res;
            const { output, errors } = data;
            if (status == '200') {
                if (!!output) {
                    logFile.write(output + '\n');
                } else if (!!errors) {
                    logFile.write(errors + '\n');
                }
                return resolve('success');
            }
            logFile.write('An unknown error has occurred. This probably is not due to your trading bot - try again later.\n');
            reject(res);
        })
        .catch(err => {
            logFile.write('An unknown error has occurred. This probably is not due to your trading bot - try again later.\n');
            reject(err)
        });
    });
}

module.exports = {
    runBot
};