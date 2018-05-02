function upload(req, res) {
  console.log(req.files);
  res.status(200).json({ success: true });
}

module.exports = {
  upload
};
