const { Types } = require('mongoose');
const axios = require('axios');
const nodemailer = require('nodemailer');

const Game = require('../models/game.model');
const Player = require('../models/player.model');
const Coin = require('../models/coin.model');
const Asset = require('../models/asset.model');
const User = require('../models/user.model');
const Trade = require('../models/trade.model');

const url = 'localhost:8080';


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
      res.status(400).json({ err: 'Name already exists' });
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

  Coin.findOne({ symbol: 'USD' }, (err, usdCoin) => {
    if (err) res.status(500).json({ err: 'MongoDB query error' });

    const usdAsset = new Asset({
      _id: new Types.ObjectId(),
      coin: usdCoin._id,
      amount: startingBalance
    });

    usdAsset.save().then((newAsset) => {
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

      player.save().then((newPlayer) => {
        game.players = [newPlayer._id];
        game.save().then((newGame) => {
          User.findOne({ username: req.session.user }, (err2, user) => {
            user.games.push(newGame._id);
            user.save().then(() => {
              Game.findOne({ _id: newGame._id })
                .populate({ path: 'players', populate: { path: 'portfolio', populate: { path: 'coin' } } })
                .exec((err3, gameToReturn) => {
                  if (err3) res.status(500).json({ err: 'MongoDB query error' });
                  res.status(200).json({ data: gameToReturn });
                });
            });
          });
        });
      });
    });
  });
}

function getGame(req, res) {
  const { id } = req.params;

  Game.findOne({ id })
    .populate({
      path: 'players',
      populate: { path: 'portfolio transactionHistory transactionCurrent', populate: { path: 'coin symbol' } }
    })
    .exec((err, game) => {
      if (err) {
        res.status(500).json({ err });
        return;
      }

      let gameToReturn = {};
      let player = {};

      if (game) {
        gameToReturn = game;
        if (req.session.user) {
          game.players.forEach((each) => {
            if (each.username === req.session.user) {
              player = each;
            }
          });
        }
      }

      res.status(200).json({ game: gameToReturn, player });
    });
}

function updateSinglePrice(li, cb) {
  if (li.length === 0) {
    cb(null);
  } else if (li[0].name !== 'US Dollars') {
    axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${li[0].symbol}&tsyms=USD`).then((res) => {
      const data = res['data']["RAW"][li[0].symbol]["USD"];

      Coin.findOne({ name: li[0].name }, (err, coin) => {
        if (err) {
          cb('MongoDB query error');
          return;
        }
        coin.set({ currPrice: parseFloat(data.PRICE) });
        coin.set({ todayReturn: parseFloat(data.CHANGEPCT24HOUR) });
        coin.save((err2) => {
          if (err2) {
            cb('MongoDB save error');
            return;
          }
          const newList = li.slice();
          newList.shift(0);
          updateSinglePrice(newList, cb);
        });
      });
    });
  } else {
    const newList = li.slice();
    newList.shift(0);
    updateSinglePrice(newList, cb);
  }
}

function updatePrices(cb) {
  Coin.find({}, (err, coins) => {
    if (err) {
      cb('MongoDB query error');
      return;
    }

    updateSinglePrice(coins, (err2) => {
      cb(err2);
    });
  });
}

function dealWithCurrentTransactions(id, cb) {
  Game.findOne({}).exec().then((game) => {
    const minutes = Math.ceil((Date.now() - game.lastUpdated.getTime()) / 1000);
    console.log(minutes);
    cb();
  });
}

function update(id, cb) {
  updatePrices((err) => {
    if (err) {
      cb(err);
      return;
    }
    dealWithCurrentTransactions(id, (err1) => {
      cb(err1);
    });
  });
}

function simpleTradeHelper(side, usd, size, coinPrice, coinId, player, assetId, cb) {
  Asset.findOne({ _id: usd._id }).exec().then((usdAsset) => {
    if (side === 'buy') {
      usdAsset.set({ amount: usdAsset.amount - (size * coinPrice) });
    } else {
      usdAsset.set({ amount: usdAsset.amount + (size * coinPrice) });
    }
    return usdAsset.save();
  }).then(() => {
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
    return trade.save();
  }).then((newTrade) => {
    player.transactionHistory.push(newTrade._id);
    return player.save();
  }).then(() => {
    cb(null);
  });
}

function simpleBuy(username, symbol, size, cb) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  Player.findOne({ _id: username }).populate(populatePath).exec().then((player) => {
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
      Coin.findOne({ symbol }).exec().then((coin) => {
        if (usd.amount < size * coin.currPrice) {
          cb('Trying to buy more than amount of USD available');
          return;
        }

        const asset = new Asset({
          _id: new Types.ObjectId(),
          coin: coin._id,
          amount: size
        });

        asset.save((err) => {
          player.portfolio.push(asset._id);
          simpleTradeHelper('buy', usd, size, coin.currPrice, coin._id, player, asset._id, cb);
        });
      });
    } else {
      if (usd.amount < size * sym.coin.currPrice) {
        cb('Trying to buy more than amount of USD available');
        return;
      }

      Asset.findOne({ _id: sym._id }).exec().then((asset) => {
        asset.set({ amount: asset.amount + size });
        return asset.save();
      }).then((err) => {
        simpleTradeHelper('buy', usd, size, sym.coin.currPrice, sym.coin._id, player, sym._id, cb);
      });
    }
  });
}

function simpleSell(username, symbol, size, cb) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  Player.findOne({ _id: username }).populate(populatePath).exec().then((player) => {
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
      cb('Not enough coin to sell');
      return;
    }

    Asset.findOne({ _id: sym._id }).exec().then((asset) => {
      if (asset.amount - size === 0) {
        const index = player.portfolio.indexOf(asset._id);
        player.portfolio.splice(index, 1);
        return Asset.remove({ _id: asset._id });
      }

      asset.set({ amount: asset.amount - size });
      return asset.save();
    }).then((err) => {
      simpleTradeHelper('sell', usd, size, sym.coin.currPrice, sym.coin._id, player, sym._id, cb);
    });
  });
}

function futureTrade(type, side, username, price, symbol, size, GTC, cb) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  Player.findOne({ _id: username }).populate(populatePath).exec().then((player) => {
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
    Coin.findOne({ symbol }).exec().then((coin) => {
      coinId = coin._id;

      if (side === 'sell' && (!sym || sym.amount < size)) {
        cb('Not enough coin to sell');
        return;
      }

      if (side === 'buy' && (usd.amount < size * price)) {
        cb('Trying to buy more than amount of USD available');
        return;
      }

      if (side === 'buy') {
        return Asset.findOne({ _id: usd._id }).exec().then((usdAsset) => {
          usdAsset.set({ amount: usdAsset.amount - (size * price) });
          return usdAsset.save();
        });
      } else {
        return Asset.findOne({ _id: sym._id }).exec().then((asset) => {
          if (asset.amount - size === 0) {
            const index = player.portfolio.indexOf(asset._id);
            player.portfolio.splice(index, 1);
            return Asset.remove({ _id: asset._id });
          }

          asset.set({ amount: asset.amount - size });
          return asset.save();
        })
      }
    }).then((asset) => {
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
    }).then(() => {
      cb(null);
    });
  });
}

function placeOrder(req, res) {
  console.log(req.body);
  const {
    type, side, size, symbol, date, GTC, gameId, playerId, price
  } = req.body;

  if (!['market', 'short', 'limit', 'stop'].includes(type) ||
      !['buy', 'sell'].includes(side)) {
    // Wrong arguments
    res.status(400).json({ error: 'Wrong arguments' });
    return;
  }

  update(gameId, (err) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }

    if (type === 'market' && side === 'buy') {
      // Regular buy
      simpleBuy(playerId, symbol, size, (err1) => {
        if (err1) {
          res.status(400).json({ err: err1 });
        } else {
          res.status(200).json({ success: true });
        }
      });
    } else if (type === 'market' && side === 'sell') {
      // Regular sell
      simpleSell(playerId, symbol, size, (err1) => {
        if (err1) {
          res.status(400).json({ err: err1 });
        } else {
          res.status(200).json({ success: true });
        }
      });
    } else if (type === 'short' && side === 'buy') {
      // Short buying
    } else if (type === 'short' && side === 'sell') {
      // Short selling
    } else if (type === 'limit' || type === 'stop') {
      // Limit buy / sell or stop buy / sell
      futureTrade(type, side, playerId, price, symbol, size, GTC, (err1 => {
        if (err1) {
          res.status(400).json({ err: err1 });
        } else {
          res.status(200).json({ success: true });
        }
      }));
    } else {
      // Wrong argument
      res.status(400).json({ error: 'Wrong arguments' });
    }
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
    let size;
    player.transactionCurrent.forEach((trade) => {
      if (trade._id.toString() === tradeId) {
        sym = trade.coin.symbol;
        coinId = trade.coin._id;
        size = trade.size;
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
    if (!symAsset) {

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
    } else {
      return Asset.findOne({ _id: symAsset }).exec().then((asset) => {
        asset.set({ amount: asset.amount + trade.size });
        return asset.save();
      });
    }
  }).then(() => {
    res.status(200).json({ success: true });
  });
}

function getAll(req, res) {
  Game.find({}).populate('players').exec().then((games) => {
    res.status(200).json({ games });
  });
}

function inviteUsers(req, res){
    const users = req.body.usernames;
    //console.log(req.body.gameId);
    const id = req.body.gameId;
    //console.log(users);

    User.find({ username: { $in: users } }).exec().then((users) => {
      //console.log(users);

      users.forEach(function(user){
       // console.log(user);
     var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
          });
        var mailOptions = {from: 'crypthubtech@gmail.com', to: user.email, subject: 'Game invite', 
        text: 'Hello,\n\n' + 'You have been invited to a game. Please click the link to view it: \nhttp:\/\/' + url + '\/game/' + id  + '\n'};
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }

                
            });



      });
      res.status(200).send({msg: 'The game invites have been sent.'});

    });
    //console.log(req.body.usernames);

        //  var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
        //   });
        // var mailOptions = {from: 'crypthubtech@gmail.com', to: user.email, subject: 'Account Verification Token', 
        // text: 'Hello,\n\n' + 'your new password is ' + newPassword + '\n' + 'Please log in.' + '\n'};
        //     transporter.sendMail(mailOptions, function (err) {
        //         if (err) { return res.status(500).send({ msg: err.message }); }

        //         res.status(200).send('A password reset email has been sent to ' + user.email + '.');
        //     });
}

module.exports = {
  validate,
  create,
  getGame,
  placeOrder,
  cancelOrder,
  getAll,
  inviteUsers
};
