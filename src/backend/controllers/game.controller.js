const _ = require('lodash');
const { Types } = require('mongoose');
const axios = require('axios');
const nodemailer = require('nodemailer');

const api = require('../api/mainRemote.js');

const Game = require('../models/game.model');
const Player = require('../models/player.model');
const Coin = require('../models/coin.model');
const Asset = require('../models/asset.model');
const User = require('../models/user.model');
const Trade = require('../models/trade.model');

const url = process.env.MODE === 'production' ? 'crypthub.s3-website-us-east-1.amazonaws.com' : 'localhost:8080';


/**
 * Validates information before creating game
 *
 * @param  req.body.name - The name of the game
 *
 * @return User object
 */
function validate(req, res) {
  const { id } = req.body;

  Game.findOne({ id }, (err, game) => {
    if (err) {
      res.status(500).json({ err: 'MongoDB query error' });
      return;
    }

    if (game) {
      res.status(400).json({ err: 'A game with this id already exists.', field: 'id' });
      return;
    }

    res.status(200).json({ success: true });
  });
}

/**
 * Create new user
 *
 * @param  req.body.name - The name of the game
 * @param  req.body.description - The game desc
 * @param  req.body.start - Start date of game
 * @param  req.body.end - End date of game
 * @param  req.body.playerPortfolioPublic - Whether players can see
 *                                          each other's portfolios
 * @param  req.body.startingBalance - Starting balance of game
 * @param  req.body.commissionValue - Commission value when trading
 * @param  req.body.shortSelling - Whether to allow short selling
 * @param  req.body.limitOrders - Whether to limit orders
 * @param  req.body.stopOrders - Whether to allow stop orders
 * @param  req.body.isPrivate - Whether the game is private
 * @param  req.body.password - Password. Set to empty string if public
 *
 * @return User object
 */
function create(req, res) {
  const {
    id, name, description, start, end,
    playerPortfolioPublic, startingBalance, commissionValue,
    shortSelling, limitOrders, stopOrders,
    isPrivate, password
  } = req.body;

  const game = new Game({
    _id: new Types.ObjectId(),
    id,
    name,
    description,
    host: req.session.user,
    start,
    end,
    created: Date.now(),
    lastUpdated: Date.now(),
    playerPortfolioPublic,
    startingBalance,
    commissionValue,
    shortSelling,
    limitOrders,
    stopOrders,
    isPrivate,
    password
  });

  Coin.findOne({ symbol: 'USD' }).exec().then((usdCoin) => {
    const usdAsset = new Asset({
      _id: new Types.ObjectId(),
      coin: usdCoin._id,
      amount: startingBalance
    });

    return usdAsset.save();
  }).then((newAsset) => {
    const player = new Player({
      _id: new Types.ObjectId(),
      username: req.session.user,
      netWorth: startingBalance,
      numTrades: 0,
      netReturn: 0,
      todayReturn: 0,
      currRank: 1,
      buyingPower: startingBalance,
      shortReserve: 0,
      portfolio: [newAsset._id]
    });

    return player.save();
  }).then((newPlayer) => {
    game.players = [newPlayer._id];
    return game.save();
  }).then(() => User.findOne({ username: req.session.user }).exec()).then((user) => {
    user.games.push(game._id);
    return user.save();
  }).then(() => {
    const populatePath = { path: 'players', populate: { path: 'portfolio', populate: { path: 'coin' } } };
    return Game.findOne({ _id: game._id }).populate(populatePath).exec();
  }).then((gameToReturn) => {
    res.status(200).json({ data: gameToReturn });
  }).catch((err) => {
    res.status(500).json({ err: err.message });
  });
}

function addTrade(side, size, coinId, coinPrice, playerId) {
  const trade = new Trade({
    _id: new Types.ObjectId(),
    type: 'market',
    side,
    size,
    price: coinPrice,
    coin: coinId,
    date: Date.now(),
    GTC: false,
    filled: true,
    filledDate: Date.now()
  });
  return trade.save().then(() => {
    return Player.findOne({ _id: playerId }).exec();
  }).then((player) => {
    player.transactionHistory.push(trade._id);
    return player.save();
  });
}

function simpleBuy(username, symbol, size) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  return Player.findOne({ _id: username }).populate(populatePath).exec().then((player) => {
    let usd;
    let sym;
    player.portfolio.forEach((each) => {
      if (each.coin.symbol === 'USD') {
        usd = each;
      }
      if (each.coin.symbol === symbol) {
        sym = each;
      }
    });

    if (!sym) {
      return Coin.findOne({ symbol }).exec().then((coin) => {
        if (usd.amount < size * coin.currPrice) {
          return Promise.reject({ message: 'You don\'t have enough buying power to place this order.', field: null });
        }

        sym = {
          _id: new Types.ObjectId(),
          coin,
          amount: size
        };

        const asset = new Asset(sym);
        return asset.save();
      }).then(() => Asset.findOne({ _id: usd._id }).exec()).then((usdAsset) => {
        usdAsset.set({ amount: usdAsset.amount - (size * sym.coin.currPrice) });
        return usdAsset.save();
      }).then(() => {
        player.portfolio.push(sym._id);
        return player.save();
      }).then(() => Promise.resolve({
        id: sym.coin._id,
        price: sym.coin.currPrice,
        player: player._id
      }));
    }

    if (usd.amount < size * sym.coin.currPrice) {
      return Promise.reject({ message: 'You don\'t have enough buying power to place this order.', field: null });
    }

    return Asset.findOne({ _id: sym._id }).exec().then((asset) => {
      asset.set({ amount: asset.amount + size });
      return asset.save();
    }).then(() => Asset.findOne({ _id: usd._id }).exec()).then((usdAsset) => {
      usdAsset.set({ amount: usdAsset.amount - (size * sym.coin.currPrice) });
      return usdAsset.save();
    }).then(() => Promise.resolve({
      id: sym.coin._id,
      price: sym.coin.currPrice,
      player: player._id
    }));
  });
}

function simpleSell(username, symbol, size) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  return Player.findOne({ _id: username }).populate(populatePath).exec().then((player) => {
    let usd;
    let sym;
    player.portfolio.forEach((each) => {
      if (each.coin.symbol === 'USD') {
        usd = each;
      }
      if (each.coin.symbol === symbol) {
        sym = each;
      }
    });

    if (!sym || sym.amount < size) {
      return Promise.reject({ message: `You don\'t have enough ${symbol} to place this order.`, field: 'size' });
    }

    return Asset.findOne({ _id: sym._id }).exec().then((asset) => {
      if (asset.amount - size === 0) {
        const index = player.portfolio.indexOf(asset._id);
        player.portfolio.splice(index, 1);
        return Asset.remove({ _id: asset._id }).then(() => player.save());
      }

      asset.set({ amount: asset.amount - size });
      return asset.save();
    }).then(() => Asset.findOne({ _id: usd._id }).exec()).then((usdAsset) => {
      usdAsset.set({ amount: usdAsset.amount + (size * sym.coin.currPrice) });
      return usdAsset.save();
    }).then(() => Promise.resolve({
      id: sym.coin._id,
      price: sym.coin.currPrice,
      player: player._id
    }));
  });
}

function updatePrices() {
  return Coin.get().then((coins) => {
    const syms = coins.join(',');
    const queryUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${syms}&tsyms=USD`;
    return axios.get(queryUrl).then((res) => {
      const data = res.data.RAW;
      const promiseLog = [];

      coins.forEach((coin) => {
        const coinData = data[coin].USD;
        const coinUpdatePromise = Coin.findOne({ symbol: coin }).exec().then((coinModel) => {
          coinModel.set({ currPrice: parseFloat(coinData.PRICE) });
          coinModel.set({ todayReturn: parseFloat(coinData.CHANGEPCT24HOUR) });
          return coinModel.save();
        });
        promiseLog.push(coinUpdatePromise);
      });
      return Promise.all(promiseLog);
    });
  });
}

function getPriceHistoryContext(id) {
  const populatePath = { path: 'players', populate: { path: 'transactionCurrent', populate: { path: 'coin' } } };
  const now = Date.now();
  return Game.findOne({ id }).populate(populatePath).exec().then((game) => {
    const minutes = Math.floor((now - game.lastUpdated.getTime()) / 60000);
    console.log(minutes);
    if (minutes < 1) {
      return Promise.resolve({ game: game.toObject(), prices: {} });
    }
    const prices = {};

    return Coin.get().then((coins) => {
      const promiseLog = [];
      coins.forEach((coin) => {
        const tr = axios.get('https://min-api.cryptocompare.com/data/histominute?' +
                  `fsym=${coin}&tsym=USD&e=CCCAGG&limit=${minutes}`).then((res) => {
          const coinPrices = res.data.Data.map(x => x.close);
          coinPrices.pop();
          prices[coin] = coinPrices;
          return Promise.resolve();
        });
        promiseLog.push(tr);
      });
      return Promise.all(promiseLog).then(() => {
        game.set({ lastUpdated: now });
        return game.save();
      }).then(() => {
        return Promise.resolve({ game: game.toObject(), prices });
      });
    });
  });
}

function fillTrade(playerId, trade) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  return Player.findOne({ _id: playerId }).populate(populatePath).exec().then((player) => {
    let usd;
    let sym;
    player.portfolio.forEach((each) => {
      if (each.coin.symbol === 'USD') {
        usd = each;
      }
      if (each.coin.symbol === trade.coin.symbol) {
        sym = each;
      }
    });

    if (trade.side === 'sell') {
      return Asset.findOne({ _id: usd._id }).exec().then((usdAsset) => {
        usdAsset.set({ amount: usdAsset.amount + (trade.size * trade.price) });
        return usdAsset.save();
      });
    }

    if (!sym) {
      const asset = new Asset({
        _id: new Types.ObjectId(),
        coin: trade.coin._id,
        amount: trade.size
      });
      return asset.save().then(() => {
        player.portfolio.push(asset._id);
        return player.save();
      });
    }

    return Asset.findOne({ _id: sym._id }).exec().then((asset) => {
      asset.set({ amount: asset.amount + trade.size });
      return asset.save();
    });
  }).then(() => {
    return Trade.findOne({ _id: trade._id }).exec().then((newTrade) => {
      newTrade.filled = true;
      newTrade.filledDate = Date.now();
      return newTrade.save();
    });
  });
}

function dealWithCurrentTransactions(id, game, prices) {
  console.log("DEALING TRANSACTIONS");
  const coins = Object.keys(prices);
  const promiseLog = [];

  coins.forEach((coin) => {
    const data = prices[coin];
    data.forEach((price) => {
      game.players.forEach((player) => {
        player.transactionCurrent.forEach((trade) => {
          if ((((trade.type === 'limit' && trade.side === 'buy') ||
                (trade.type === 'stop' && trade.side === 'sell')) &&
               price <= trade.price && trade.coin.symbol === coin) ||
              (((trade.type === 'limit' && trade.side === 'sell') ||
                (trade.type === 'stop' && trade.side === 'buy')) &&
               price >= trade.price && trade.coin.symbol === coin)) {
            promiseLog.push(fillTrade(player._id, trade));
            player.transactionCurrent = player.transactionCurrent.filter(each => each !== trade);
            player.transactionHistory.push(trade._id);
          }
        });
      });
    });
  });

  if (promiseLog.length > 0) {
    return Promise.all(promiseLog).then(() => {
      const userPromises = [];
      game.players.forEach((p) => {
        const userP = Player.findOne({ _id: p._id }).exec().then((player) => {
          player.transactionCurrent = p.transactionCurrent;
          player.transactionHistory = p.transactionHistory;
          return player.save();
        });
        userPromises.push(userP);
      });
      return Promise.all(userPromises);
    });
  }

  return Promise.resolve();
}

async function runAllBots(game, prices) {
  const coins = Object.keys(prices);
  console.log(prices);
  const histLength = prices[coins[0]].length;

  for (let i = 0; i < histLength; i++) {
    const currCoins = [];
    coins.forEach((coin) => {
      currCoins.push({ symbol: coin, price: prices[coin][i] });
    });

    for (let j = 0; j < game.players.length; j++) {
      const player = game.players[j];
      if (player.activeBotId) {
        await api.runBot(player.activeBotId, game._id, player._id, currCoins);
      }
    }
  }
}

function update(id) {
  return updatePrices().then(() => {
    return getPriceHistoryContext(id);
  }).then((data) => {
    if (Object.keys(data.prices).length > 0) {
      return dealWithCurrentTransactions(id, data.game, data.prices).then(() => {
        runAllBots(data.game, data.prices);
        return Promise.resolve();
      });
    }
    return Promise.resolve();
  });
}

function futureTrade(type, side, username, price, symbol, size, GTC) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  return Player.findOne({ _id: username }).populate(populatePath).exec().then((player) => {
    let usd;
    let sym;
    player.portfolio.forEach((each) => {
      if (each.coin.symbol === 'USD') {
        usd = each;
      }
      if (each.coin.symbol === symbol) {
        sym = each;
      }
    });

    let coinId;
    return Coin.findOne({ symbol }).exec().then((coin) => {
      coinId = coin._id;

      if (side === 'sell' && (!sym || sym.amount < size)) {
        return Promise.reject({ message: `You don\'t have enough ${symbol} to place this order.`, field: 'size' });
      }

      if (side === 'buy' && (usd.amount < size * price)) {
        return Promise.reject({ message: 'You don\'t have enough buying power to place this order.', field: null });
      }

      if (((type === 'limit' && side === 'buy') || (type === 'stop' && side === 'sell')) &&
          coin.currPrice < price) {
        return Promise.reject({ message: 'The price cannot be above the current market price.', field: 'price' });
      }

      if (((type === 'limit' && side === 'sell') || (type === 'stop' && side === 'buy')) &&
          coin.currPrice > price) {
        return Promise.reject({ message: 'The price cannot be below the current market price.', field: 'price' });
      }

      if (side === 'buy') {
        return Asset.findOne({ _id: usd._id }).exec().then((usdAsset) => {
          usdAsset.set({ amount: usdAsset.amount - (size * price) });
          return usdAsset.save();
        });
      }

      return Asset.findOne({ _id: sym._id }).exec().then((asset) => {
        if (asset.amount - size === 0) {
          const index = player.portfolio.indexOf(asset._id);
          player.portfolio.splice(index, 1);
          return Asset.remove({ _id: asset._id });
        }

        asset.set({ amount: asset.amount - size });
        return asset.save();
      });
    }).then(() => {
      const trade = new Trade({
        _id: new Types.ObjectId(),
        type,
        side,
        size,
        price,
        coin: coinId,
        date: Date.now(),
        GTC,
        filled: false
      });
      return trade.save();
    }).then((newTrade) => {
      player.transactionCurrent.push(newTrade._id);
      return player.save();
    });
  });
}

function getGame(req, res) {
  const { id } = req.params;
  const username = req.session.user;
  const populatePath = {
    path: 'players',
    populate: {
      path: 'portfolio transactionHistory transactionCurrent',
      populate: { path: 'coin symbol' }
    }
  };

  Game.findOne({ id }).exec().then((thisGame) => {
    if (thisGame && !thisGame.completed) {
      update(id).then(() => {
        return Game.findOne({ id }).populate(populatePath).lean().exec();
      }).then((game) => {
        const gameToReturn = game;
        let player = {};

        if (req.session.user) {
          game.players.forEach((each) => {
            if (each.username === req.session.user) {
              player = each;
            }
          });
        }

        if (new Date() >= new Date(game.end)) {
          User.find({ username: { $in: _.map(game.players, 'username') } }).exec()
          .then(( users ) => {
            const playersWithELO = _.sortBy(_.map(game.players, p => _.set(p, 'ELO', _.find(users, { username: p.username }).ELO)), p => p.currRank);
            console.log('calculated elos:', calculateFullELO(_.concat(playersWithELO, [])));
          // set completed to true
          // save game, players?
          });
        }

        if (!(Object.keys(player).length === 0 && player.constructor === Object)) {
          User.findOne({ username }).populate('tradingBots').lean().exec().then((user) => {
            player.tradingBots = user.tradingBots;
            res.status(200).json({ game: gameToReturn, player });
          });
        } else {
          res.status(200).json({ game: gameToReturn, player });
        }
      });
    } else if (thisGame && thisGame.completed) {
      Game.findOne({ id }).populate(populatePath).lean().exec()
      .then(game => {
        let player = {};

        if (req.session.user) {
          game.players.forEach((each) => {
            if (each.username === req.session.user) {
              player = each;
            }
          });
        }
        res.status(200).json({ game, player });
      });   
    } else {
      res.status(200).json({ game: {}, player: {} });
    }
  });
}

function placeOrder(req, res) {
  console.log(req.body);
  const {
    type, side, size, symbol, GTC, gameId, playerId, price
  } = req.body;

  if (!['market', 'short', 'limit', 'stop'].includes(type) ||
      !['buy', 'sell'].includes(side)) {
    // Wrong arguments
    res.status(400).json({ error: 'Wrong arguments' });
    return;
  }

  update(gameId).then(() => {
    if (type === 'market' && side === 'buy') {
      // Regular buy
      simpleBuy(playerId, symbol, size).then((data) => {
        return addTrade(side, size, data.id, data.price, data.player);
      }).then(() => {
        res.status(200).json({ success: true });
      }).catch((err1) => {
        res.status(400).json({ err: err1.message, field: err1.field });
      });
    } else if (type === 'market' && side === 'sell') {
      // Regular sell
      simpleSell(playerId, symbol, size).then((data) => {
        return addTrade(side, size, data.id, data.price, data.player);
      }).then(() => {
        res.status(200).json({ success: true });
      }).catch((err1) => {
        res.status(400).json({ err: err1.message, field: err1.field });
      });
    } else if (type === 'short' && side === 'buy') {
      // Short buying
    } else if (type === 'short' && side === 'sell') {
      // Short selling
    } else if (type === 'limit' || type === 'stop') {
      // Limit buy / sell or stop buy / sell
      futureTrade(type, side, playerId, price, symbol, size, GTC).then(() => {
        res.status(200).json({ success: true });
      }).catch((err1) => {
        res.status(400).json({ err: err1.message, field: err1.field });
      });
    } else {
      // Wrong argument
      res.status(400).json({ error: 'Wrong arguments' });
    }
  }).catch((err) => {
    res.status(400).json({ err: err.message });
  });
}

function cancelOrder(req, res) {
  const { gameId, playerId, tradeId } = req.body;
  const populatePath = { path: 'portfolio transactionCurrent', populate: { path: 'coin' } };

  let usdAsset;
  let symAsset;
  Player.findOne({ _id: playerId }).populate(populatePath).exec().then((player) => {
    let sym;
    let coinId;
    let side;
    player.transactionCurrent.forEach((trade) => {
      if (trade._id.toString() === tradeId) {
        sym = trade.coin.symbol;
        coinId = trade.coin._id;
        side = trade.side;
      }
    });

    const index = player.transactionCurrent.indexOf(tradeId);
    player.transactionCurrent.splice(index, 1);

    player.portfolio.forEach((each) => {
      if (each.coin.symbol === 'USD') {
        usdAsset = each._id;
      }
      if (each.coin.symbol === sym) {
        symAsset = each._id;
      }
    });

    let asset;
    if (!symAsset && side === 'sell') {
      asset = new Asset({
        _id: new Types.ObjectId(),
        coin: coinId,
        amount: 0
      });
      symAsset = asset._id;
      player.portfolio.push(asset._id);
      return asset.save().then(() => {
        player.save();
      });
    }

    return player.save();
  }).then(() => {
    return Trade.findOne({ _id: tradeId }).populate('coin');
  }).then((trade) => {
    if (trade.side === 'buy') {
      return Asset.findOne({ _id: usdAsset }).exec().then((asset) => {
        asset.set({ amount: asset.amount + (trade.size * trade.price) });
        return asset.save();
      });
    }

    if (!symAsset) {

    }


    return Asset.findOne({ _id: symAsset }).exec().then((asset) => {
      asset.set({ amount: asset.amount + trade.size });
      return asset.save();
    });
  }).then(() => {
    res.status(200).json({ success: true });
  });
}

function getAll(req, res) {
  Game.find({ completed: false }).populate('players').exec().then((games) => {
    res.status(200).json({ games });
  });
}

function setBot(req, res) {
  const { playerId, botId } = req.body;
  Player.findOne({ _id: playerId }).exec().then((player) => {
    player.set({ activeBotId: botId });
    player.set({ activeBotLog: '' });
    return player.save();
  }).then(() => {
    res.status(200).json({ success: true });
  }).catch((err) => {
    res.status(500).json({ err: 'Internal server error', traceback: err });
  });
}

function inviteUsers(req, res){
    const users = req.body.usernames;
    //console.log(req.body.gameId);
    const id = req.body.gameId;
    //console.log(users);

    User.find({ username: { $in: users } }).exec().then(( users) => {

      console.log(users.length);

      if (users.length == 0){
        return res.status(500).send({err: 'These users do not exist. Please check the usernames you have inputted are correct.', field: 'users'});
      }

      users.forEach(function(user){
        console.log(user);
     if (!user){
      return res.status(500).send({err: 'This user' + user.username + 'does not exist', field: 'user'});
     };
     var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
          });
        var mailOptions = {from: 'crypthubtech@gmail.com', to: user.email, subject: 'Game invite',
        text: 'Hello,\n\n' + 'You have been invited to a game. Please click the link to view it: \nhttp:\/\/' + url + '\/game/' + id  + '\n'};
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ err: 'Can not send email to this user' + user.username, field: 'email'}); }


            });



      });
      res.status(200).send({msg: 'The game invites have been sent.'});

    });

}

function calulate2ELO(winnerELO, loserELO, draw){

  var Kvalue = 300;


  var winnerTransformed = Math.pow(10,(winnerELO/400));
  var loserTransformed = Math.pow(10,(loserELO/400));



  var winnerExpected = winnerTransformed/(winnerTransformed + loserTransformed);
  var loserExpected = loserTransformed/(winnerTransformed + loserTransformed);



  var actualWinnerScore = 1;
  var actualLoserScore = 0;



  if (draw){
    var actualDrawWinnerELO = winnerELO + Kvalue*(.5-winnerExpected);
    var actualDrawLoserELO = loserELO + Kvalue*(.5-winnerExpected);
    return [actualDrawWinnerELO,actualDrawLoserELO];

  }

else{

  var actualWinnerELO = winnerELO + Kvalue*(1-winnerExpected);
  var actualLoserELO = loserELO + Kvalue*(0-loserExpected);

  return [actualWinnerELO, actualLoserELO];
}
}

function calculateFullELO(playersz){
  var players = [];
  for (var i in playersz){
    players[i] = playersz[i].ELO;
  }
  console.log(players);
  if (players.length == 0){
    return 'no players inputted';
  }
  // check

  var winnerELO = 0;
  var loserELO = 0;
  var drawerELO = 0;
  var ELOArray = [];

  for (var i in players){
    
    var playerELO = players[i];
    var index = players.indexOf(playerELO);
    var topIndex = index-1;
    var bottomIndex = index+1;


    if (topIndex >= 0 && topIndex < players.length - 1){

      // if players have drawn
      if (players[topIndex] == playerELO){
        var drawArray = calulate2ELO(players[topIndex], playerELO, 1);
        drawerELO = drawArray[1];

      }
      else{

      var playerWonELO = players[topIndex];
      var lostArray = calulate2ELO(playerWonELO, playerELO, 0);
      var loserELO = lostArray[1];
    }

    }




    if (bottomIndex > 0 && bottomIndex <= players.length - 1 ){

        // if players have drawn
      if (players[bottomIndex] == playerELO){
        var drawArray = calulate2ELO(players[bottomIndex], playerELO, 1);
        drawerELO = drawArray[1];

      }

      else{
      var playerLostELO = players[bottomIndex];
      var wonArray = calulate2ELO(playerELO, playerLostELO, 0);
      var winnerELO = wonArray[0];
    }

    }


    if (drawerELO){

      ELOArray[i] = Math.round(drawerELO);
    }

    else{

      if (topIndex < 0){
        var realELO  = Math.round(winnerELO);
        console.log(winnerELO);
        console.log(realELO);
        ELOArray[i] = realELO;
      }

      else if(bottomIndex > players.length-1){
        var realELO = Math.round(loserELO);
        console.log(loserELO);
        console.log(realELO);
        ELOArray[i] = realELO;
      }

      else{
      var realELO = Math.round((winnerELO + loserELO)/2)
      ELOArray[i] = realELO;
      }

     }
     
     playersz[i].eloDelta = ELOArray[i] - players[i];
  }

  return playersz;

}





module.exports = {
  validate,
  create,
  getGame,
  placeOrder,
  cancelOrder,
  getAll,
  setBot,
  inviteUsers,
  calculateFullELO
};
