const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function retry(options) {
  console.log('REDIS CONNECTION LOST');
  console.log(options);
  if (options.total_retry_time > 1000 * 60 * 5) {
    return new Error('Retry time exhausted');
  }
  if (options.times_connected > 10) {
    return;
  }
  return Math.max(options.attempt * 100, 3000);
}

function getConfig(config) {
  return Object.assign({}, {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: retry
  }, config);
}

function createClient(config) {
  return redis.createClient(getConfig(config));
}

module.exports = {
  createClient: createClient,
  getConfig: getConfig,
  retryStrategy: retry
};
