const chai = require('chai');
const chai_as_promised = require('chai-as-promised');
chai.use(chai_as_promised);
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

      it('should have a promise oriented api', () => {
        const client = createClient();
        return expect(client.infoAsync())
          .to.have.been.fulfilled
          .and.then(infos => {
          expect(infos).to.have.length.above(1);
        });
      });

      it('should have a promise oriented api for mutli', () => {
        const client = createClient();
        const multi = client.multi();
        multi.set('something', 42);
        multi.get('something');
        return multi.execAsync().then((results) =>{
          expect(results[0]).to.be.equal('OK');
          expect(results[1]).to.be.equal('42');
        });
      });

      //this is just a nightmare to automate this kind of test
      it.skip('should connect, disconnect, then reconnect', (done) => {
        const client = createClient({
          host: 'unstable-redis'
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
