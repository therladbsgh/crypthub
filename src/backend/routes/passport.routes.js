const { Router } = require('express');

function configPassportRouter(passport) {
  const router = new Router();

  router.route('/signup').post((req, res) => {
    passport.authenticate('signup', (err, user, info) => {
      if (err) {
        res.status(500).json({ err: 'bad' });
      } else if (!user) {
        res.status(401).json({ message: 'abc', type: 'internal' });
      } else {
        res.status(200).json({ err: null });
      }
    })(req, res);
  });

  return router;
}

module.exports = configPassportRouter;

