const User = require('../models/user.model.js');
const Token = require('../models/token.model.js');

require('../db.js');

function wipeAll() {
  User.remove({}, () => {});
  Token.remove({}, () => {});
  console.log('Database wiped.');
}
wipeAll();

module.exports = {
  wipeAll
};
