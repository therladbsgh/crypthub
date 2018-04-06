const { Router } = require('express');
const userRoutes = require('./user.routes');

const router = Router();

router.use('/ping', (req, res) => {
  res.send('OK');
});

router.use('/users', userRoutes);

module.exports = router;
