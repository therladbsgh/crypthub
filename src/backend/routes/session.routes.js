const { Router } = require('express');
const SessionController = require('../controllers/session.controller');

const router = new Router();

router.route('/signup').post(SessionController.signup);
router.route('/login').post(SessionController.login);
router.route('/logout').post(SessionController.logout);

module.exports = router;
