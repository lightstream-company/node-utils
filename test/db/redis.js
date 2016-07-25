const {expect} = require('chai');
const {createClient} = require('../../db/redis');

describe('integrated', () => {
  describe('redis', () => {

    describe('createClient', () => {

      it('should be a function', () => {
        expect(createClient).to.be.a('function');
      });

      it('should connect to redis', (done) => {
        const client = createClient();
        client.info((error, infos) => {
          expect(infos).to.have.length.above(1);
          done();
        });
      });

      it.skip('should connect to another database with custom env', (done) => {
        process.env.REDIS_HOST = 'redis';
        const client = createClient();
        client.info((error, infos) => {
          expect(infos).to.have.length.above(1);
          done();
        });
      });

    });
  });
});
