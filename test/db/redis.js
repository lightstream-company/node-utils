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

      it('should connect to database with custom env', (done) => {
        const client = createClient();
        client.info((error, infos) => {
          expect(infos).to.have.length.above(1);
          done();
        });
      });

      //this is just a nightmare to automate this kind of test
      it.skip('should connect, disconnect, then reconnect', (done) => {
        const client = createClient({
          host:'unstable-redis'
        });
        client.info((error, infos) => {
          expect(infos).to.have.length.above(1);
          setTimeout(() => {
            client.info((error2) => {
              expect(error2).to.not.be.equal(null);
              setTimeout(() => {
                client.info((error3, infos3) => {
                  expect(infos3).to.have.length.above(1);
                  done();
                });
              }, 4000);
            });
          }, 4000);
        });
      });

    });
  });
});
