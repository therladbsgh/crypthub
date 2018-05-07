const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/token.model');

//const url = 'localhost:8080';
const Bot = require('../models/bot.model');


const url = process.env.MODE === 'production' ? 'crypthub.s3-website-us-east-1.amazonaws.com' : 'localhost:8080';




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


  // User.findOne({email}, (err,user)=>{
  //     if (err) {
  //     res.status(500).json({ err: 'MongoDB Server Error: Cannot query' });
  //     return;
  //   }
  //     console.log(user);
  //     if (user) {
  //       console.log('User already exists with this email', email);
  //       res.status(401).send({err: 'User with this email already exists', field: 'email'});
  //       return;
  //     }

  // User.findOne({ username }, (err, user) => {
  //   if (err) {
  //     res.status(500).json({ err: 'MongoDB Server Error: Cannot query' });
  //     return;
  //   }

  //   if (user) {
  //     console.log('User already exists with username: ', username);
  //     res.status(401).send({ err: 'Username already exists', field: 'username' });
  //     return;
  //   }






  //   const newUser = new User();

  //   newUser.username = username;
  //   newUser.password = createHash(password);
  //   newUser.email = email;

  //   newUser.save((err2) => {
  //     if (err2) {
  //       res.status(500).send({ err: 'MongoDB Server Error: Cannot save' });
  //       return;
  //     }


  //     var token = new Token({username: newUser.username, token: crypto.randomBytes(16).toString('hex')});


  //     token.save(function (err){
  //       if (err){
  //         res.status(500).send({err: 'MongoDB Server Error: Cannot save token'});
  //       }

  //       var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
  //         });
  //       var mailoptions = {from: 'crypthubtech@gmail.com', to: newUser.email, subject: 'Account Verification Token',
  //       text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + url + '\/verifyEmail?token=\/' + token.token + '&email=' + newUser.email + '\n'};
  //       transporter.sendMail(mailoptions, function(err){

  //         if (err){
  //           res.status(500).send({err: 'Cannot send email'});

  //         }

  //       })

  //     });

  //     res.status(200).json({ result: newUser });
  //   });
  // });




  //   });


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


      token.save(function (err){
        if (err){
          res.status(500).send({err: 'MongoDB Server Error: Cannot save token'});
        }

        var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
          });
        var mailoptions = {from: 'crypthubtech@gmail.com', to: newUser.email, subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your CryptHub account by clicking the link: \nhttp:\/\/' + url + '\/verifyEmail?token=\/' + token.token + '&email=' + newUser.email + '\n'};
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
      res.status(401).send({ err: 'Your email is not verified, please verify your account.', field: 'email'});
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
  if (!req.session.user) {
    res.status(403).json({ err: 'Your session has expired. Please log in again.', field: 'session-expired' });
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


        if (!token) return res.status(400).send({ err: 'This token is invalid. Your token may have expired.', field: 'not-verified' });


        User.findOne({ username: token.username }, function (err, user) {

            if (!user) return res.status(400).send({ err: 'Verification token not found.', field: 'Token' });
            if (user.isVerified) return res.status(400).send({ err: 'This user has already been verified. You can log in normally.', field: 'already-verified' });



            user.isVerified = true;


            user.save(function (err) {

                if (err) { return res.status(500).send({ err: 'MongoDB Server could not save user' }); }

                res.status(200).send({msg: "Your account has been verified! You may now log in."});

            });
        });
    });
};




/**
* Token resending middleware
*
*@return
*/

function resendToken(req, res) {
  //console.log('here');

    var email = req.query.email;


    User.findOne({ email: email }, function (err, user) {


        if (!user) return res.status(400).send({ err: 'We were unable to find a user with that email.', field: 'invalid-username' });

        if (user.isVerified) return res.status(400).send({ err: 'This account has already been verified. Please log in.', field: 'already-verified' });

        // Create a verification token, save it, and send email
        var token = new Token({ username: user.username, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ err: 'MongoDB Server Error: Cannot save Token'  }); }

            // Send the email
              var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
          });
        var mailoptions = {from: 'crypthubtech@gmail.com', to: user.email, subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your CryptHub account by clicking the link: \nhttp:\/\/' + url + '\/verifyEmail?token=\/' + token.token + '&email='+ email + '\n'};
            transporter.sendMail(mailoptions, function (err) {

                if (err) { return res.status(500).send({ msg: 'unable to send email', field: 'invalid-email' }); }
                
                res.status(200).send({msg: 'A verification email has been sent to ' + user.email + '.'});
            });
        });

    });
}

function forgot(req, res){
// query database by email


    var email = req.body.email;



    User.findOne({ email: email }, function (err, user) {

         if (!user) return res.status(400).send({ err: 'We were unable to find a user with that email.', field: 'invalid-email' });
        console.log(user);

        var newPassword = crypto.randomBytes(4).toString('hex');
        user.password = createHash(newPassword);
        console.log(user.password);
        console.log(newPassword);
        // possible get rid of next line
        user.isVerified = true;
            user.save(function (err) {
            if (err) { return res.status(500).send({ err: 'MongoDB Server Error: Cannot save user password' }); }

            // Send the email
              var transporter = nodemailer.createTransport({service: 'gmail', auth: {user: 'crypthubtech@gmail.com', pass: 'CSCI1320'}
          });
        var mailOptions = {from: 'crypthubtech@gmail.com', to: user.email, subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'your new password is ' + newPassword + '\n' + 'Please log in.' + '\n'};
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }

                res.status(200).send('A password reset email has been sent to ' + user.email + '.');
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
  // THIS IS FOR TESTING -- LEAVE UNTIL REMOTE STUFF WORKS
  // const mainRemote = require('../api/mainRemote.js');
  // mainRemote.runBot('./src/bots/users/user1/tradingbot1/tradingbot1.js', './src/bots/users/user1/tradingbot1/log.txt', 'GAMEID', 'PLAYERID', [2, 3, 4])
  // .then(res => {
  //   console.log('trading bot success!');
  // })
  // .catch(err => {
  //   console.log('trading bot error: ', err);
  // });


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

/**
 * Gets username list from database.
 *
 * @return user name if exists, null otherwise
 */
function getAllUsers(req, res) {
  User.find({$query: {}, $orderby: {ELO: 1}}).exec().then((users) => {
    if (!users) {
      res.status(500).send({ err: 'Can not find users', field: 'users' });
      return;
    }
    
    res.status(200).send({ users });
  });
}

/**
 * Gets user email from database based on session.
 *
 * @return user email if exists, error 500 otherwise
 */
function getUserEmail(req, res) {

  if (req.session.user){
  User.get(req.session.user).then((user) => {
    console.log(user);
    if (!user){
      return res.status(500).send({err: 'Can not find user', field: 'user'});
    }
    res.status(200).send({ email: user.email });
  });
}
else {
  return res.status(500).send({err: 'User session does not exist', field: 'session'});
}
}

/**
 * Changes user email
 *
 * @return 200 on sucess with message, 500 on error
 */
function saveEmail(req, res) {

  var newEmail = req.body.email;
  console.log(newEmail);

  if (req.session.user){
  User.get(req.session.user).then((user) => {


    if (!user){
      return res.status(500).send({err: 'Can not find user', field: 'user'});
    }

    user.email = newEmail;

    user.save(function(err){

      if (err) { return res.status(500).send({ err: 'MongoDB Server Error: Cannot save user email' }); }

      res.status(200).send({msg: 'user email has been saved as' + newEmail});


    });
    console.log(user);



  });

}
else {
  return res.status(500).send({err: 'User session does not exist. Please log in and try again', field: 'session'});
}
}


/**
 * Changes user password
 *
 * @return 200 on sucess with message, 500 on error
 */
function savePassword(req, res) {

  var newPassword = req.body.password;
  console.log(newPassword);

  if (req.session.user){
  User.get(req.session.user).then((user) => {
    console.log(user);

    if (!user){
      return res.status(500).send({err: 'Can not find user', field: 'user'});
    }

    user.password = createHash(newPassword);

    user.save(function(err){

      if (err) { return res.status(500).send({ err: 'MongoDB Server Error: Cannot save user password' }); }

      res.status(200).send({msg: 'user password has been saved as' + newPassword});


    });

    console.log(user);

  });

}
else {
  return res.status(500).send({err: 'User session does not exist. Please log in and try again', field: 'session'});
}
}


function deleteUser(req, res){

if (req.session.user){
  User.get(req.session.user).then((user) => {

    if (!user){``
      console.log('here1');
      return res.status(500).send({err: 'Can not find user', field: 'user'});
    }
   
    tradingBots = user.tradingBots; 

    tradingBots.forEach((bot) =>{
      Bot.remove({bot}).exec().then(() =>{
        console.log('bot removed');
      }).catch(() =>{
        console.log('here2');
        res.status(500).json({err: 'MongoDB removal error, field: trading-bot'});
      })
    });



    console.log(tradingBots);

    User.remove({username: req.session.user}, function(err){
      if(err){
        console.log(err);
        console.log('here5');
        res.status(500).send({err: 'MongoDB removal error', field: 'MongoDB'});
      }
      console.log('made it');
      logout(req,res);
    });


  });
}


else {
  console.log('here4')
  return res.status(500).send({err: 'User session does not exist. Please log in and try again', field: 'session'});
}
}







module.exports = {
  isValidPassword,
  createHash,
  signup,
  login,
  logout,
  authenticate,
  getUser,
  resendToken,
  confirmToken,
  forgot,
  getAllUsers,
  getUserEmail,
  saveEmail,
  savePassword,
  deleteUser,
  ensureAuthenticated

};
