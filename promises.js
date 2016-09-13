'use strict';

const request = require('request');

function wait(delay) {
  return new Promise((fulfill) => {
    setTimeout(fulfill, delay);
  });
}

function get(url) {
  return new Promise((fulfill, reject) => {
    function getError(response, body) {
      return new Error(`Error while fetching from url "${url}". status code : ${response.statusCode}. message : ${body}`);
    }

    return request.get({
      url,
      json: true
    }, handleResponse(getError, fulfill, reject));
  });
}

function preparePutOrPost(verb) {
  return function putOrPost(url, payload) {
    return new Promise((fulfill, reject) => {
      function getError(response, body) {
        return new Error(`Error while ${verb}ing to url "${url}" with payload "${JSON.stringify(payload)}". status code : ${response.statusCode}. message : ${body}`);
      }

      return request[verb]({
        url,
        body: payload,
        json: true
      }, handleResponse(getError, fulfill, reject))
    });
  };
}

function del(url) {
  return new Promise((fulfill, reject) => {
    function getError(response, body) {
      return new Error(`Error while deleting from url "${url}". status code : ${response.statusCode}. message : ${body}`);
    }

    return request.del({
      url,
      json: true
    }, handleResponse(getError, fulfill, reject))
  });
}

function handleResponse(getError, fulfill, reject) {
  return (error, response, body) => {
    if (error) {
      return reject(error);
    }
    if (response.statusCode > 299) {
      return reject(getError(response, body));
    }
    fulfill(body);
  };
}

module.exports = {
  wait,
  request: {get, post: preparePutOrPost('post'), put: preparePutOrPost('put'), del}
};