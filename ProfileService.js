/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

/**
 * @param {Object} [config = {urls: {base: 'FIXME'}}]
 * @param {string} [config.baseURL] - The protocol, host and port for use with
 *   node.js (e.g. https://example.com)
 * @param {object} [config.httpsAgent] - An optional
 *   node.js `https.Agent` instance to use when making requests.
 * @param {Object} [config.urls = {}]
 * @param {string} [config.urls.base = 'FIXME']
 */
export class ProfileService {
  constructor({
    baseURL,
    httpsAgent,
    urls = {
      base: 'FIXME'
    }
  } = {}) {
    this.config = {urls};
    const headers = {Accept: 'application/ld+json, application/json'};
    this._axios = axios.create({
      baseURL,
      headers,
      httpsAgent,
    });
  }

  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = 'FIXME'] - The url to use.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async create({
    url = this.config.urls.base,
  }) {
    try {
      const response = await this._axios.post(url, {});
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }
}

function _rethrowAxiosError(error) {
  if(error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // FIXME: there may be better wrappers already created
    if(error.response.data.message && error.response.data.type) {
      throw new Error(
        `${error.response.data.type}: ${error.response.data.message}`);
    }
  }
  throw new Error(error.message);
}
