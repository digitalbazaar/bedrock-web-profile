/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

/**
 * @param {Object} [config = {urls: {base: '/profiles'}}]
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
      base: '/profiles',
      profileAgents: '/profile-agents'
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
   * @param {string} [options.url = '/profiles'] - The service url to use.
   * @param {string} [options.account] - The account to associate with the
   *                                     profile agent.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async create({url = this.config.urls.base, account} = {}) {
    try {
      const response = await this._axios.post(url, {account});
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async createAgent(
    {url = this.config.urls.profileAgents, account, profile} = {}) {
    try {
      const response = await this._axios.post(url, {account, profile});
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async getAllAgents({url = this.config.urls.profileAgents, account} = {}) {
    try {
      const endpoint = `${url}?account=${account}`;
      const response = await this._axios.get(endpoint);
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   * @param {string} [options.id] - The id for the profile.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async getAgent({url = this.config.urls.profileAgents, id, account} = {}) {
    try {
      const endpoint = `${url}/${id}?account=${account}`;
      const response = await this._axios.get(endpoint);
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async getAgentByProfile(
    {url = this.config.urls.profileAgents, account, profile} = {}) {
    try {
      const endpoint = `${url}?profile=${profile}&account=${account}`;
      const response = await this._axios.get(endpoint);
      if(response.data.length == 0) {
        throw new Error('"profileAgent" not found.');
      }
      return response.data[0];
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }
  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async delegateAgentCapabilities(
    {url = this.config.urls.profileAgents, profileAgentId, account, id} = {}) {
    try {
      const endpoint = `${url}/${profileAgentId}/capabilities/delegate` +
        `?id=${id}` +
        `&account=${account}`;
      const response = await this._axios.get(endpoint);
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }
  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async getAgentCapabilitySet(
    {url = this.config.urls.profileAgents, profileAgentId, account} = {}) {
    try {
      const endpoint = `${url}/${profileAgentId}/capability-set` +
        `?account=${account}`;
      const response = await this._axios.get(endpoint);
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }
  /**
   *
   * @param {Object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async updateAgentCapabilitySet(
    {url = this.config.urls.profileAgents, profileAgentId, account,
      zcaps} = {}) {
    try {
      const endpoint = `${url}/${profileAgentId}/capability-set` +
        `?account=${account}`;
      const response = await this._axios.post(endpoint, {zcaps});
      return response.status === 204;
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
