const { Router } = require('express');
const userRoutes = require('./user.routes');
const sessionRoutes = require('./session.routes');
const gameRoutes = require('./game.routes');
const coinRoutes = require('./coin.routes');


const router = Router();

router.use('/ping', (req, res) => {
  res.send('OK');
});

router.use('/passport', sessionRoutes);
router.use('/users', userRoutes);
router.use('/game', gameRoutes);
router.use('/coin', coinRoutes);

module.exports = router;
