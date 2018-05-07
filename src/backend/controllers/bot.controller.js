const path = require('path');
const fs = require('fs');
const { Types } = require('mongoose');

const Bot = require('../models/bot.model');
const User = require('../models/user.model');

function upload(req, res) {
  const file = req.files.code;
  const { user } = req.session;
  const { name } = file;

  const botId = new Types.ObjectId();
  const botData = {
    _id: botId,
    name,
    data: file.data.toString('utf8'),
    log: ''
  };

  User.getBots(user).then((bots) => {
    for (let i = 0; i < bots.length; i++) {
      if (bots[i].name === name) {
        return Promise.reject(Error('400'));
      }
    }
    return Promise.resolve();
  }).then(() => {
    const bot = new Bot(botData);
    return bot.save();
  }).then(() => {
    return User.findOne({ username: user }).exec();
  }).then((userObj) => {
    userObj.tradingBots.push(botId);
    return userObj.save();
  }).then(() => {
    res.status(200).json(botData);
  }).catch((err) => {
    if (err.message === '400') {
      res.status(400).send({ err: 'File name already exists' });
    } else {
      res.status(500).send({ err: 'Internal server error' });
    }
  });
}

function create(req, res) {
  const { user } = req.session;

  const botId = new Types.ObjectId();
  const templatePath = '../../bots/support/template.js';
  const code = fs.readFileSync(path.join(__dirname, templatePath), 'utf8');

  const botData = {
    _id: botId,
    name: `${Math.random().toString(36).substring(7)}.js`,
    data: code,
    log: ''
  };

  const bot = new Bot(botData);
  bot.save().then(() => {
    return User.findOne({ username: user }).exec();
  }).then((userObj) => {
    userObj.tradingBots.push(botId);
    return userObj.save();
  }).then(() => {
    botData.data = code;
    res.status(200).send(botData);
  }).catch(() => {
    res.status(500).send({ err: 'Internal server error' });
  });
}

function save(req, res) {
  const { botId, data, botName } = req.body;

  Bot.findOne({ _id: botId }).exec().then((bot) => {
    bot.set({ name: botName });
    bot.set({ data });
    return bot.save();
  }).then(() => {
    res.status(200).json({ success: true });
  }).catch(() => {
    res.status(500).json({ err: 'Internal server error' });
  });
}

function remove(req, res) {
  const { botId } = req.body;
  const username = req.session.user;

  Bot.remove({ _id: botId }).then(() => {
    return User.findOne({ username }).exec();
  }).then((user) => {
    const index = user.tradingBots.indexOf(botId);
    user.tradingBots.splice(index, 1);
    return user.save();
  }).then(() => {
    res.status(200).json({ success: true });
  }).catch((err) => {
    res.status(500).json({ err: 'Internal server error', traceback: err });
  });
}

module.exports = {
  upload,
  create,
  save,
  remove
};
