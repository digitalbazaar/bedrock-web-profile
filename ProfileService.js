/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

/**
 * @param {object} [config = {urls: {base: '/profiles'}}] - The config options.
 * @param {string} [config.baseURL] - Protocol, host & port used with Node.js
 *   such as https://example.com.
 * @param {object} [config.httpsAgent] - An optional
 *   node.js `https.Agent` instance to use when making requests.
 * @param {object} [config.urls = {}]
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
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles'] - The service url to use.
   * @param {string} options.account - An Account ID.
   * @param {object} [options.didMethod] - Supported: 'key' and 'v1'.
   * @param {string} [options.didOptions] - Hashmap of optional DID method
   *   options.
   *
   * @returns {Promise<object>} Resolves when the operation completes.
   */
  async create({
    url = this.config.urls.base, account, didMethod, didOptions} = {}) {
    try {
      const response = await this._axios.post(
        url, {account, didMethod, didOptions}
      );
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   *
   * @param {object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   * @param {string} [options.account] - An Account ID.
   * @param {string} [options.profile] - A profile ID.
   * @param {string} [options.token] - An application token.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async createAgent(
    {url = this.config.urls.profileAgents, account, profile, token} = {}) {
    try {
      const response = await this._axios.post(url, {account, profile, token});
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   *  Claims a profile agent by associating an account with the agent.
   *
   * @param {object} options - The options to use.
   * @param {string} [options.url = '/profiles-agents'] - The service url to
   *   use.
   * @param {string} [options.account] - An Account ID.
   * @param {string} options.profileAgent - The profile agent ID to associate
   *   with the account.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async claimAgent({
    url = this.config.urls.profileAgents, account, profileAgent
  } = {}) {
    try {
      // this HTTP API returns 204 with no body on success
      await this._axios.post(
        `${url}/${encodeURIComponent(profileAgent)}/claim`, {account});
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles-agents'] - The service url to
   *   use.
   * @param {string} [options.account] - An Account ID.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async getAllAgents({url = this.config.urls.profileAgents, account} = {}) {
    try {
      const response = await this._axios.get(url, {params: {account}});
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles-agents'] - The service url to
   *   use.
   * @param {string} [options.id] - The id for the profile.
   * @param {string} [options.account] - An Account ID.
   * @returns {Promise} Resolves when the operation completes.
   */
  async getAgent({url = this.config.urls.profileAgents, id, account} = {}) {
    try {
      const endpoint = `${url}/${encodeURIComponent(id)}`;
      const response = await this._axios.get(endpoint, {params: {account}});
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles-agents'] - The service url to
   *   use.
   * @param {string} [options.id] - The id for the profile.
   * @param {string} [options.account] - An Account ID.
   * @returns {Promise} Resolves when the operation completes.
   */
  async deleteAgent({url = this.config.urls.profileAgents, id, account} = {}) {
    try {
      const endpoint = `${url}/${encodeURIComponent(id)}`;
      const response = await this._axios.delete(endpoint, {params: {account}});
      return response.status === 204;
    } catch(e) {
      if(e.response.status === 404) {
        return true;
      }
      _rethrowAxiosError(e);
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles-agents'] - The service url to
   *   use.
   * @param {string} options.account - An Account ID.
   * @param {string} options.profile - A profile id.
   * @returns {Promise} Resolves when the operation completes.
   */
  async getAgentByProfile(
    {url = this.config.urls.profileAgents, account, profile} = {}) {
    try {
      const response = await this._axios.get(url, {params: {profile, account}});
      if(response.data.length === 0) {
        throw new Error('"profileAgent" not found.');
      }
      return response.data[0];
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles-agents'] - The service url to
   *   use.
   * @param {string} options.profileAgentId - A Profile Agent id.
   * @param {string} options.account - An Account ID.
   * @param {string} options.invoker - The invoker to delegate capabilities to.
   * @returns {Promise} Resolves when the operation completes.
   */
  async delegateAgentCapabilities({
    url = this.config.urls.profileAgents, profileAgentId, account, invoker
  } = {}) {
    try {
      const endpoint =
        `${url}/${encodeURIComponent(profileAgentId)}/capabilities/delegate`;
      const response = await this._axios.post(endpoint, {account, invoker});
      return response.data;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles-agents'] - The service url to
   *   use.
   * @param {string} options.profileAgentId - A Profile Agent id.
   * @param {string} options.account - An Account ID.
   * @param {object} options.zcaps - An object in which each property
   *   contains a valid zcap.
   * @returns {Promise} Resolves when the operation completes.
   */
  async updateAgentCapabilitySet(
    {url = this.config.urls.profileAgents, profileAgentId, account,
      zcaps} = {}) {
    try {
      const endpoint = `${url}/${encodeURIComponent(profileAgentId)}` +
        `/capability-set`;
      const response = await this._axios.post(endpoint, {zcaps},
        {params: {account}});
      return response.status === 204;
    } catch(e) {
      _rethrowAxiosError(e);
    }
  }

  /**
   * @param {object} options - The options to use.
   * @param {string} [options.url='/profiles-agents'] - The service url to
   *   use.
   * @param {string} options.profileAgentId - A Profile Agent id.
   * @param {string} options.account - An Account ID.
   * @returns {Promise} Resolves when the operation completes.
   */
  async deleteAgentCapabilitySet(
    {url = this.config.urls.profileAgents, profileAgentId, account} = {}) {
    try {
      const endpoint = `${url}/${encodeURIComponent(profileAgentId)}` +
        `/capability-set`;
      const response = await this._axios.delete(endpoint, {params: {account}});
      return response.status === 204;
    } catch(e) {
      if(e.response.status === 404) {
        return true;
      }
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
