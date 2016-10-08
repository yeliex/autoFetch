"use strict";

const realFetch = require('isomorphic-fetch/fetch-npm-node.js');
const { responseMiddleware, parseUrl } = require('./utils');

let globalCallback = response => response;
let baseHost = '';

const fetchRequest = (url, options = {}, ...extras) => {
  return realFetch.call(this, parseUrl(url, options,baseHost), options, ...extras).then(responseMiddleware).then(globalCallback);
};

fetchRequest.callback = (callback) => {
  if (typeof callback === 'function') {
    globalCallback = callback;
  }
  delete fetchRequest.callback;
};

fetchRequest.baseHost = (host) => {
  baseHost = host;
};

global.fetch = fetchRequest;

module.exports = fetchRequest;
