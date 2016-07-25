const redis = require('redis');

function getConfig(config) {
  return Object.assign({}, config || {}, {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  });
}

function createClient(config) {
  return redis.createClient(getConfig(config));
}

module.exports = {
  createClient: createClient,
  getConfig: getConfig
};
