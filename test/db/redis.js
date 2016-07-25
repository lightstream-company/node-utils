const chai = require('chai');
const redis = require('../../db/redis');

const createClient = redis.createClient;
const expect = chai.expect;

describe('integrated', () => {
  describe('redis', () => {

    describe('createClient', () => {

      it('should be a function', () => {
        expect(createClient).to.be.a('function');
      });

      it.skip('should connect to database with custom env', (done) => {
        const client = createClient();
        client.info((error, infos) => {
          expect(infos).to.have.length.above(1);
          done();
        });
      });

    });
  });
});
