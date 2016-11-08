"use strict";

const realFetch = require('isomorphic-fetch/fetch-npm-node.js');
const { responseMiddleware, parseUrl } = require('./../libs/utils');

let globalCallback = response => response;
let baseHost = '';

const fetchRequest = (url, options = {}, ...extras) => {
  options.data ? (options.method === 'GET' || options.method === 'HEAD') ? options.query = { ...(options.query || {}), ...options.data } : options.body = { ...(options.body || {}), ...options.data } : '';

  if (!options.method || options.method === 'GET') {
    options.query = options.body || options.data;
  }

  // use object insteadof Header temporary
  options.headers = options.headers || {};
  if (options.headers['Content-Type'] !== 'application/json' && options.headers['Content-Type'] !== 'multipart/form-data' && !(typeof options.body === 'string') && !(options.body instanceof FormData)) {
    // convert to FormData
    options.body = toFormData(options.body);
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  if ((!options.method || options.method === 'GET' || options.method === 'HEAD') && options.body) {
    delete options.body;
  }

  return realFetch.call(this, parseUrl(url, options, baseHost), options, ...extras).then(responseMiddleware).then(globalCallback);
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
