const { Router } = require('express');
const UserController = require('../controllers/user.controller');

const router = new Router();

router.route('/:id').get(UserController.get);
router.route('/create').post(UserController.create);

module.exports = router;
