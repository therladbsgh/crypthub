const path = require('path');

function upload(req, res) {
  const file = req.files.code;
  file.mv(path.join(__dirname, `../bots/${file.name}`)).then(() => {
    res.status(200).send({ success: true });
  });
}

module.exports = {
  upload
};
