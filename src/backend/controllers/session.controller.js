const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/token.model');
const url = 'localhost:8080';


/**
 * Generates hash using bCrypt
 * @param  password : The password
 *
 * @return the hashed password
 */
function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/**
 * Compares password string to a hashed string
 * @param  user : The user object from MongoDB
 * @param  password : The hashed password string
 *
 * @return true if password and hashed string match, false otherwise
 */
function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

/**
 * Sign up method.
 * @param  req.body.username - The username
 * @param  req.body.password - The password
 * @param  req.body.email - The email
 *
 * @return 500 on server error, 401 if user exists, 200 if success
 */
function signup(req, res) {
  const { username, password, email } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ err: 'MongoDB Server Error: Cannot query' });
      return;
    }

    if (user) {
      console.log('User already exists with username: ', username);
      res.status(401).send({ err: 'Username already exists', field: 'username' });
      return;
    }





    const newUser = new User();

    newUser.username = username;
    newUser.password = createHash(password);
    newUser.email = email;

    newUser.save((err2) => {
      if (err2) {
        res.status(500).send({ err: 'MongoDB Server Error: Cannot save' });
        return;
      }

      

      var token = new Token({username: newUser.username, token: crypto.randomBytes(16).toString('hex')});
      console.log(token);
      
      token.save(function (err){
        if (err){
          res.status(500).send({err: 'MongoDB Server Error: Cannot save token'});
        }

        var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
          });
        var mailoptions = {from: 'crypthubtech@gmail.com', to: newUser.email, subject: 'Account Verification Token', 
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + url + '\/verifyEmail?token=\/' + token.token + '&email=' + newUser.email + '\n'};
        transporter.sendMail(mailoptions, function(err){
          if (err){
            res.status(500).send({err: 'Cannot send email'});
          }
        })
        
      });

      res.status(200).json({ result: newUser });
    });
  });
}

/**
 * Login method.
 * @param  req.body.login - The login username or email
 * @param  req.body.password - The password
 *
 * @return 500 on server error, 401 if user does not exist, 200 if success
 */
function login(req, res) {
  const loginObj = req.body.login;
  const { password } = req.body;

  User.findOne({ $or: [{ username: loginObj }, { email: loginObj }] }, (err, user) => {
    if (err) {
      res.status(500).json({ err: 'MongoDB Server Error: Cannot query' });
      return;
    }

    if (!user) {
      res.status(401).send({ err: 'User not found', field: 'username' });
      return;
    }

    if (!isValidPassword(user, password)) {
      res.status(401).send({ err: 'Invalid password', field: 'password' });
      return;
    }

   
    if (!user.isVerified){
      res.status(401).send({ err: 'not-verified', field: 'email'});
      return;
    } 
       

    req.session.user = user.username;
    req.session.id = user._id;
    req.session.save();

    
    res.status(200).send({ success: true, user: user.username});
    

  });
}


/**
 * Logout method.
 *
 * @return 500 on server error, 200 if success
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ err: 'Server error' });
    }
    res.status(200).json({ success: true });
  });
}


/**
 * Authentication middleware.
 *
 * @return 403 if authentication failed, calls next otherwise
 */
function authenticate(req, res, next) {
  if (req.session.user) {
    res.status(403).json({ err: 'Not logged in' });
  } else {
    next();
  }
}
/**
* Token confirmation middleware
*
* @return 400 if confirmation failed, 200 otherwise with appropriate message
*/

function confirmToken (req, res, next) {
  
   
    var tokened = req.query.token;
    
    var newToken = tokened.substring(1,33);
    
    
    
    Token.findOne({ token: newToken}, function (err, token) {

      
        if (!token) return res.status(400).send({ err: 'not-verified', field: 'We were unable to find a valid token. Your token my have expired.' });
        console.log('made it');
        // If we found a token, find a matching user
        User.findOne({ username: token.username }, function (err, user) {
            if (!user) return res.status(400).send({ err: 'Token not found', field: 'Token' });
            if (user.isVerified) return res.status(400).send({ err: 'already-verified', field: 'User' });
 
            // Verify and save the user
            user.isVerified = true;
            console.log(user.isVerified);

            user.save(function (err) {
                if (err) { return res.status(500).send({ err: 'MongoDB Server could not save user' }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};




/**
* Token resending middleware
*
*@return
*/

function resendToken(req, res, next) {
    
 
      
  
 
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ username: user.username, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
              var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
          });
        var mailoptions = {from: 'crypthubtech@gmail.com', to: newUser.email, subject: 'Account Verification Token', 
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + url + '\/verifyEmail?token=\/' + token.token + '&email=email\n'};
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
};



/**
 * Gets user name from session.
 *
 * @return user name if exists, null otherwise
 */
function ensureAuthenticated(req, res) {
  if (req.session.user) {
    res.json({ username: req.session.user });
  } else {
    res.json({});
  }
}

/**
 * Gets user name from session.
 *
 * @return user name if exists, null otherwise
 */
function getUser(req, res) {
  if (req.session.user) {
    User.get(req.session.user).then((result) => {
      result.password = undefined;
      res.json({ user: result });
    }).catch((err) => {
      res.json({ err });
    });
  } else {
    res.json({});
  }
}

module.exports = {
  signup,
  login,
  logout,
  authenticate,
  getUser,
  resendToken,
  confirmToken,
  ensureAuthenticated

};
