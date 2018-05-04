const User = require('../models/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/token.model');
const url = 'localhost:8080';
const sessionController = require('../controllers/session.controller');


const chai = require('chai');
const mocha = require('mocha');
const sinon = require('sinon');


var expect = chai.expect;
/*
*Tests that a in the User model the field isVerified is always false until a user signs up and verifies their email.
*returns true on succes, false otherwise 
*/
describe('user', function() {
    it('should be valid if isVerified is false', function(done) {
        var m = new User();
 
        m.validate(function(err) {
            //expect(err.errors.name).to.exist;
            chai.assert(m.isVerified == false, 'isVerified is always false before a user is isVerified');
            done();
        });
    });
});

/*
*Test that the method isValidPassword in session.controller.js correctly validates an encrypted password and 
* the password as string 
*returns true on succes, false otherwise 
*/
describe('isValidPassword', function() {
    it('should be valid if isValidPassword is true', function(done) {
        var m = new User();
        var password = 'password'
       
        encryptedPassword = sessionController.createHash(password);
        m.password = encryptedPassword;
        
        var result = sessionController.isValidPassword(m,password);
 		

        m.validate(function(err) {
        	
            chai.assert(result, 'isValidPassword returns true if an encryptedPassword is the same as its string version');
            done();
        });
    });
});

// /*
// * Test the method login, 
// *
// * returns true on success, false otherwise 
// */
// describe('login route', function() {
//     beforeEach(function() {
//         sinon.stub(User, 'findOne');
//     });
 
 
//     afterEach(function() {
//         User.findOne.restore();
//     });
 
//     it('should set req.session parameters and return success and username ', function() {

//        	var m = new User();
//        	m.username = 'm';
//        	m.password = sessionController.createHash('password');
//        	m.email = 'email@email.com';
//        	m.isVerified = true;

//         var yields = sinon.stub().yields();

//         User.findOne.yields(null, m);

//         //console.log(User.findOne(m));
       


//         var req = { body: { login: 'email@email.com', password: 'password'} };
//         var res = {
//             send: sinon.stub()
//         };


 
//         sessionController.login(req, res);

 
//         sinon.assert.calledWith(res.send, { success: true, user: m.username});
//     });
// });





