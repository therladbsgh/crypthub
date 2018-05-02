const path = require('path');
const fs = require('fs');

function upload(req, res) {
  const file = req.files.code;
  const user = req.session.user;
  const name = file.name;

  const userPath = path.join(__dirname, `../../bots/users/${user}`);
  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath);
  }

  const botPath = path.join(__dirname, `../../bots/users/${user}/${name}`);
  if (!fs.existsSync(botPath)) {
    fs.mkdirSync(botPath);
  }

  file.mv(path.join(__dirname, `../../bots/users/${user}/${name}/bot.js`)).then(() => {
    res.status(200).send({ success: true });
  });
}

module.exports = {
  upload
};
