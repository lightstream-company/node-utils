/*eslint no-unused-vars:0 */
'use strict';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chai_as_promised = require('chai-as-promised');
chai.use(chai_as_promised);
require('co-mocha');
const nock = require('nock');

const {wait, request:{get, post, put, del}} = require('../promises');

describe('utils promised oriented functions behavior', () => {

  describe('wait', () => {
    function getTime() {
      return new Date().getTime();
    }

    it('should wait for a certain time span', function*() {
      const begin = getTime();

      yield wait(20);

      const end = getTime();
      expect(end - begin).to.be.closeTo(20, 7);
    });
  });

  describe('request get, post, delete', () => {
    const host = 'http://whatever:8080';
    const url = host + '/path';

    describe('get calls', () => {
      it('should parse body as JSON', function* () {
        nock(host)
          .get('/path')
          .reply(200, {a:1});

        const response = yield get(url);

        response.a.should.equal(1);
      });

      it('should raise an error when error', () => {
        return get(url).should.have.been.rejected;
      });

      it('should raise an error when status code is not 2xx', () => {
        nock(host)
          .get('/path')
          .reply(404);

        return get(url).should.have.been.rejectedWith(/while fetching from/);
      });
    });

    describe('post calls', () => {
      it('should post json and parse body as JSON', function* () {
        nock(host)
          .filteringRequestBody(/.*/, '*')
          .post('/path', '*')
          .reply(201, function(uri, requestBody) {
            return requestBody;
          });

        const response = yield post(url, {b:2});

        response.b.should.equal(2);
      });

      it('should raise an error when error', () => {
        return post(url, {b:2}).should.have.been.rejected;
      });

      it('should raise an error when status code is not 2xx', () => {
        nock(host)
          .filteringRequestBody(/.*/, '*')
          .post('/path', '*')
          .reply(502);

        return post(url, {b:2}).should.have.been.rejectedWith(/while posting to/);
      });
    });

    describe('put calls', () => {
      it('should put json and parse body as JSON', function* () {
        nock(host)
          .filteringRequestBody(/.*/, '*')
          .put('/path', '*')
          .reply(201, function(uri, requestBody) {
            return requestBody;
          });

        const response = yield put(url, {c:3});

        response.c.should.equal(3);
      });

      it('should raise an error when error', () => {
        return put(url, {c:3}).should.have.been.rejected;
      });

      it('should raise an error when status code is not 2xx', () => {
        nock(host)
          .filteringRequestBody(/.*/, '*')
          .put('/path', '*')
          .reply(502);

        return put(url, {c:3}).should.have.been.rejectedWith(/while puting to/);
      });
    });

    describe('delete calls', () => {
      it('should delete a resource from url', () => {
        nock(host)
          .delete('/path')
          .reply(201, function(uri, requestBody) {
            return requestBody;
          });

        return del(url).should.have.been.fulfilled;
      });

      it('should raise an error when error', () => {
        return del(url).should.have.been.rejected;
      });

      it('should raise an error when status code is not 2xx', () => {
        nock(host)
          .delete('/path')
          .reply(401);

        return del(url).should.have.been.rejectedWith(/while deleting/);
      });
    });

    afterEach(() => {
      nock.cleanAll();
    });
  });
});