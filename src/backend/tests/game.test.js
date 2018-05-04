const chai = require('chai');
const chaiHttp = require('chai-http');

const { assert } = chai;

chai.use(chaiHttp);
const agent = chai.request.agent('http://localhost:5000');

describe('Game creation and validation', () => {
  beforeEach((done) => {
    agent.post('/passport/login')
      .send({
        login: 'test',
        password: 'test'
      })
      .end(() => {
        done();
      });
  });

  const name = Math.random().toString(36).substring(7);
  const gameData = {
    id: name,
    name,
    description: 'A',
    start: Date.now(),
    end: Date.now(),
    playerPortfolioPublic: true,
    startingBalance: 1000,
    commissionValue: 10,
    shortSelling: false,
    limitOrders: true,
    stopOrders: true,
    isPrivate: false,
    password: ''
  };

  it('can validate game', (done) => {
    agent.post('/game/validate')
      .send(gameData)
      .end((err, res) => {
        assert(res.status === 200, 'Status is not 200');
        done();
      });
  });

  it('can create game', (done) => {
    agent.post('/game/create')
      .send(gameData)
      .end((err, res) => {
        assert(res.status === 200, 'Status is not 200');

        const game = res.body.data;
        assert(game.id === gameData.id, 'saved id is not the same');
        assert(game.name === gameData.name, 'saved name is not the same');
        assert(game.description === gameData.description, 'saved desc is not the same');
        assert(new Date(game.start).getTime() === gameData.start, 'saved start date is not the same');
        assert(new Date(game.end).getTime() === gameData.end, 'saved end date is not the same');
        assert(game.playerPortfolioPublic === gameData.playerPortfolioPublic, 'saved playerPortfolioPublic is not equal');
        assert(game.startingBalance === gameData.startingBalance, 'saved startingBalance is not equal');
        assert(game.commissionValue === gameData.commissionValue, 'saved commissionValue is not equal');
        assert(game.shortSelling === gameData.shortSelling, 'saved shortSelling is not equal');
        assert(game.limitOrders === gameData.limitOrders, 'saved limitOrders is not equal');
        assert(game.stopOrders === gameData.stopOrders, 'saved stopOrders is not equal');
        assert(game.isPrivate === gameData.isPrivate, 'saved isPrivate is not equal');
        assert(game.password === gameData.password, 'saved password is not equal');
        assert(!game.completed, 'game is completed upon creation');
        done();
      });
  });

  it('can fail validation if ID exists', (done) => {
    agent.post('/game/validate')
      .send(gameData)
      .end((err, res) => {
        assert(res.status !== 200, 'Status is 200');
        done();
      });
  });
});
