'use strict';

function wait(delay) {
  return new Promise((fulfill) => {
    setTimeout(fulfill, delay);
  });
}

module.exports = {
  wait
};