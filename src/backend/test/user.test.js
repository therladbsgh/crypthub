const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp);

describe('Basic user test', () => {
  it('can be created', (done) => {
    chai.request('http://localhost:5000').post('/users/create')
      .send({ username: 'Heya', password: 'Heyaa', email: 'heya@heya.com' })
      .end((err, res) => {
        assert(res.status === 200, 'Status code is not 200');

        const user = res.body;
        assert(user, 'User is not returned');
        assert.equal(user.username, 'Heya', 'Username is not the same');
        assert.equal(user.password, 'Heyaa', 'Password is not the same');
        assert.equal(user.email, 'heya@heya.com', 'Email is not the same');

        chai.request('http://localhost:5000').get('/users/Heya')
          .end((err, res) => {
            assert(res.status === 200, 'Get user status code is not 200');
            const newUser = res.body.result;
            assert(newUser, 'User is not returned');
            assert.equal(newUser.username, 'Heya', 'Username is not the same');
            assert.equal(newUser.password, 'Heyaa', 'Password is not the same');
            assert.equal(newUser.email, 'heya@heya.com', 'Email is not the same');
            done();
          });
      });
  });

  it ('can be deleted', (done) => {
    chai.request('http://localhost:5000').post('/users/delete')
      .send({ username: 'Heya' })
      .end((err, res) => {
        assert(res.status == 200, 'Status code is not 200');
        assert(res.body.success, 'JSON not returned');

        chai.request('http://localhost:5000').get('/users/Heya')
          .end((err, res) => {
            assert(res.status === 404, 'Get user status code is not 404');
            done();
          });
      });
  });
});
