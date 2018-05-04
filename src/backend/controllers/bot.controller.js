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
  const userPath = path.join(__dirname, `../../bots/users/${user}`);
  const botPath = path.join(__dirname, `../../bots/users/${user}/${botId}`);

  User.getBots(user).then((bots) => {
    for (let i = 0; i < bots.length; i++) {
      if (bots[i].name === name) {
        return Promise.reject(Error('400'));
      }
    }
    return Promise.resolve();
  }).then(() => {
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath);
    }

    fs.mkdirSync(botPath);
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
  const templatePath = path.join(__dirname, '../../bots/support/template.js');
  const userPath = path.join(__dirname, `../../bots/users/${user}`);
  const botPath = path.join(__dirname, `../../bots/users/${user}/${botId}`);
  const botFilePath = path.join(__dirname, `../../bots/users/${user}/${botId}/bot.js`);

  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath);
  }

  fs.mkdirSync(botPath);
  const code = fs.readFileSync(templatePath, 'utf8');
  fs.writeFileSync(botFilePath, code);

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
  }).catch((err) => {
    if (err.message === '400') {
      res.status(400).send({ err: 'File name already exists', field: null });
    } else {
      res.status(500).send({ err: 'Internal server error', field: null });
    }
  });
}

module.exports = {
  upload,
  create
};
