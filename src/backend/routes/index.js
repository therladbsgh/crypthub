const { Router } = require('express');
const userRoutes = require('./user.routes');
const sessionRoutes = require('./session.routes');


const router = Router();

router.use('/ping', (req, res) => {
  res.send('OK');
});

router.use('/sessions', (req, res) => {
  // Update views
  console.log(req.session);
  let i = 0;
  if (req.session.views) {
    i = parseInt(req.session.views);
  }
  i++;
  req.session.views = i.toString();

  // Write response
  res.end(req.session.views);
});

router.use('/getData', (req, res) => {
  console.log('hit getData endpoint');
  res.json({ data: 'this is data' });
});

router.use('/passport', sessionRoutes);
router.use('/users', userRoutes);

module.exports = router;
