const path = require('path');
const fs = require('fs');
const { Types } = require('mongoose');

const Bot = require('../models/bot.model');
const User = require('../models/user.model');

function upload(req, res) {
  const file = req.files.code;
  const { user } = req.session;
  const { name } = file;

  const userPath = path.join(__dirname, `../../bots/users/${user}`);
  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath);
  }

  const botPath = path.join(__dirname, `../../bots/users/${user}/${name}`);
  if (!fs.existsSync(botPath)) {
    fs.mkdirSync(botPath);
  }

  const botFilePath = path.join(__dirname, `../../bots/users/${user}/${name}/bot.js`);
  if (fs.existsSync(botFilePath)) {
    res.status(500).send({ err: 'File with the same name already exists.', field: null });
    return;
  }

  const bot = new Bot({
    _id: new Types.ObjectId(),
    name,
    path: botPath
  });

  file.mv(path.join(__dirname, `../../bots/users/${user}/${name}/bot.js`)).then(() => {
    return bot.save();
  }).then(() => {
    return User.findOne({ username: user }).exec();
  }).then((userObj) => {
    userObj.tradingBots.push(bot._id);
    return userObj.save();
  }).then(() => {
    res.status(200).send({ success: true });
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ err: 'Internal server error', field: null });
  });
}

module.exports = {
  upload
};
