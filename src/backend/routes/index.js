const { Router } = require('express');
const userRoutes = require('./user.routes');
const sessionRoutes = require('./session.routes');
const gameRoutes = require('./game.routes');
const coinRoutes = require('./coin.routes');
const botRoutes = require('./bot.routes');
const playerRoutes = require('./player.routes');


const router = Router();

router.use('/ping', (req, res) => {
  res.send('OK');
});

router.use('/passport', sessionRoutes);
router.use('/users', userRoutes);
router.use('/game', gameRoutes);
router.use('/coin', coinRoutes);
router.use('/bot', botRoutes);
router.use('/player', playerRoutes);

module.exports = router;
