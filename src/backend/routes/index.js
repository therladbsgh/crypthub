const { Router } = require('express');
const userRoutes = require('./user.routes');
const sessionRoutes = require('./session.routes');
const gameRoutes = require('./game.routes');


const router = Router();

router.use('/ping', (req, res) => {
  res.send('OK');
});

router.use('/getData', (req, res) => {
  console.log('hit getData endpoint');
  res.json({ data: 'this is data' });
});

router.use('/passport', sessionRoutes);
router.use('/users', userRoutes);
router.use('/game', gameRoutes);

module.exports = router;
