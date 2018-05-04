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
  const userPath = `../../bots/users/${user}`;
  const botPath = `../../bots/users/${user}/${botId}`;

  User.getBots(user).then((bots) => {
    for (let i = 0; i < bots.length; i++) {
      if (bots[i].name === name) {
        return Promise.reject(Error('400'));
      }
    }
    return Promise.resolve();
  }).then(() => {
    if (!fs.existsSync(path.join(__dirname, userPath))) {
      fs.mkdirSync(path.join(__dirname, userPath));
    }

    fs.mkdirSync(path.join(__dirname, botPath));
    return file.mv(path.join(__dirname, `../../bots/users/${user}/${botId}/bot.js`));
  }).then(() => {
    const bot = new Bot({
      _id: botId,
      name,
      path: botPath
    });

    return bot.save();
  }).then(() => {
    return User.findOne({ username: user }).exec();
  }).then((userObj) => {
    userObj.tradingBots.push(botId);
    return userObj.save();
  }).then(() => {
    res.status(200).send({ success: true });
  }).catch((err) => {
    if (err.message === '400') {
      res.status(400).send({ err: 'File name already exists', field: null });
    } else {
      res.status(500).send({ err: 'Internal server error', field: null });
    }
  });
}

function create(req, res) {
  const { user } = req.session;

  const botId = new Types.ObjectId();
  const templatePath = '../../bots/support/template.js';
  const userPath = `../../bots/users/${user}`;
  const botPath = `../../bots/users/${user}/${botId}`;
  const botFilePath = `../../bots/users/${user}/${botId}/bot.js`;

  if (!fs.existsSync(path.join(__dirname, userPath))) {
    fs.mkdirSync(path.join(__dirname, userPath));
  }

  fs.mkdirSync(path.join(__dirname, botPath));
  const code = fs.readFileSync(path.join(__dirname, templatePath), 'utf8');
  fs.writeFileSync(path.join(__dirname, botFilePath), code);

  const botData = {
    _id: botId,
    name: `${Math.random().toString(36).substring(7)}.js`,
    path: botPath
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
    res.status(500).send({ err: 'Internal server error', field: null });
  });
}

function save(req, res) {
  const { user } = req.session;
  const { botId, data, botName } = req.body;
  const botFilePath = `../../bots/users/${user}/${botId}/bot.js`;

  fs.writeFileSync(path.join(__dirname, botFilePath), data);
  Bot.findOne({ _id: botId }).exec().then((bot) => {
    bot.set({ name: botName });
    return bot.save();
  }).then(() => {
    res.status(200).json({ success: true });
  }).catch(() => {
    res.status(500).json({ err: 'Internal server error', field: null });
  });
}

function remove(req, res) {
  const { botId } = req.body;
  const username = req.session.user;
  const botPath = path.join(__dirname, `../../bots/users/${username}/${botId}`);

  Bot.remove({ _id: botId }).then(() => {
    return User.findOne({ username }).exec();
  }).then((user) => {
    const index = user.tradingBots.indexOf(botId);
    user.tradingBots.splice(index, 1);
    return user.save();
  }).then(() => {
    const files = fs.readdirSync(botPath);
    files.forEach((file) => {
      fs.unlinkSync(path.join(botPath, file));
    });
    fs.rmdirSync(botPath);

    res.status(200).json({ success: true });
  }).catch((err) => {
    res.status(500).json({ err: 'Internal server error', traceback: err, field: null });
  });
}

module.exports = {
  upload,
  create,
  save,
  remove
};
