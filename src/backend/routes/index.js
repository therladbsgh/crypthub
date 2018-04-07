const { Router } = require('express');
const userRoutes = require('./user.routes');

const router = Router();

router.use('/ping', (req, res) => {
  res.send('OK');
});

router.use('/getData', (req, res) => {
  console.log('hit getData endpoint');
  res.json({ data: 'this is data' });
});

router.use('/users', userRoutes);

module.exports = router;
