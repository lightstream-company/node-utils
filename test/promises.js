/*eslint no-unused-vars:0 */
'use strict';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
require('co-mocha');

const {wait} = require('../promises');

describe('utils promised oriented functions behavior', () => {
  function getTime() {
    return new Date().getTime();
  }

  it('should wait for a certain time span', function* () {
    const begin = getTime();

    yield wait(20);

    const end = new Date().getTime();
    expect(end - begin).to.be.closeTo(20, 2);
  });
});