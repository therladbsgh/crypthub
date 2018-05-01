const { Router } = require('express');
const SessionController = require('../controllers/session.controller');

const router = new Router();

/**
 * Sign up method.
 * @param  username - The username
 * @param  password - The password
 * @param  email - The email
 *
 * @return 500 on server error, 401 if user exists, 200 if success
 */
router.route('/signup').post(SessionController.signup);

/**
* Login method
 * @param  login - The login username or email
 * @param  password - The password
 *
 * @return 500 on server error, 401 if user does not exist, 200 if success
 */
router.route('/login').post(SessionController.login);

/**
 * Logout method.
 *
 * @return 500 on server error, 200 if success
 */
router.route('/logout').get(SessionController.logout);

/**
 * Gets user name from session.
 *
 * @return user name if exists, null otherwise
 */
router.route('/user').get(SessionController.getUser);
router.route('/username').get(SessionController.ensureAuthenticated);

/**
* confirm token method.
* @param token
*
* @return 400 on error, 200 on success
*/

router.route('/verifyEmail').get(SessionController.confirmToken);

/**
* resend token method
* @param token
* @return 400 on error, 200 on success
*/

router.route('/sendVerification').get(SessionController.resendToken);

/**
*
* forgot password method 
*@return 400 on error, 200 on success
*/
router.route('/forgot').post(SessionController.forgot);

/**
*
* forgot password method 
*@return 400 on error, 200 on success
*/
router.route('/getAllUsers').post(SessionController.getAllUsers);


module.exports = router;
