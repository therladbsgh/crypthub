const { Router } = require('express');
const UserController = require('../controllers/user.controller');

const router = new Router();

/**
 * Gets the user by ID.
 * @param  id - The id
 *
 * @return User object
 */
router.route('/:id').get(UserController.get);

/**
 * Create new user
 *
 * @param  username - The username
 * @param  password - The password
 * @param  email - The email
 *
 * @return User object
 */
router.route('/create').post(UserController.create);

/**
 * Deletes user
 *
 * @param username - The username
 *
 * @return { success: true } on success, { err: message } otherwise
 */
router.route('/delete').post(UserController.remove);

module.exports = router;
