/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */

import {httpClient} from '@digitalbazaar/http-client';

/**
 * @param {object} [config = {urls: {base: '/profiles'}}] - The config options.
 * @param {string} [config.baseURL] - Protocol, host & port used with Node.js
 *   such as https://example.com.
 * @param {object} [config.urls = {}]
 * @param {string} [config.urls.base = 'FIXME']
 */
export class ProfileService {
  constructor({
    baseURL,
    urls = {
      base: '/profiles',
      profileAgents: '/profile-agents'
    }
  } = {}) {
    this.config = {urls};
    this.baseURL = baseURL;
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const response = await httpClient.post(
        url, {
          prefixUrl: this.baseURL,
          json: {account, didMethod, didOptions}
        });
      return response.data;
    } catch(e) {
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const response = await httpClient.post(
        url, {
          prefixUrl: this.baseURL,
          json: {account, profile, token}
        });
      return response.data;
    } catch(e) {
      _rethrowHttpError(e);
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
    if(url.startsWith('/')) {
      url = url.substring(1);
    }
    try {
      // this HTTP API returns 204 with no body on success
      await httpClient.post(
        `${url}/${encodeURIComponent(profileAgent)}/claim`, {
          prefixUrl: this.baseURL,
          json: {account}
        });
    } catch(e) {
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const response = await httpClient.get(
        url, {
          prefixUrl: this.baseURL,
          searchParams: {account}
        });
      return response.data;
    } catch(e) {
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const endpoint = `${url}/${encodeURIComponent(id)}`;
      const response = await httpClient.get(
        endpoint, {
          prefixUrl: this.baseURL,
          searchParams: {account}
        });
      return response.data;
    } catch(e) {
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const endpoint = `${url}/${encodeURIComponent(id)}`;
      const response = await httpClient.delete(
        endpoint, {
          prefixUrl: this.baseURL,
          searchParams: {account}
        });
      return response.status === 204;
    } catch(e) {
      if(e.response.status === 404) {
        return true;
      }
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const response = await httpClient.get(
        url, {
          prefixUrl: this.baseURL,
          searchParams: {profile, account}
        });
      if(response.data.length === 0) {
        throw new Error('"profileAgent" not found.');
      }
      return response.data[0];
    } catch(e) {
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const endpoint =
        `${url}/${encodeURIComponent(profileAgentId)}/capabilities/delegate`;
      const response = await httpClient.post(
        endpoint, {
          prefixUrl: this.baseURL,
          json: {account, invoker}
        });
      return response.data;
    } catch(e) {
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const endpoint = `${url}/${encodeURIComponent(profileAgentId)}` +
        `/capability-set`;
      const response = await httpClient.post(endpoint, {
        prefixUrl: this.baseURL,
        json: {zcaps},
        searchParams: {account}
      });
      return response.status === 204;
    } catch(e) {
      _rethrowHttpError(e);
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
      if(url.startsWith('/')) {
        url = url.substring(1);
      }
      const endpoint = `${url}/${encodeURIComponent(profileAgentId)}` +
        `/capability-set`;
      const response = await httpClient.delete(
        endpoint, {
          prefixUrl: this.baseURL,
          searchParams: {account}
        });
      return response.status === 204;
    } catch(e) {
      if(e.response.status === 404) {
        return true;
      }
      _rethrowHttpError(e);
    }
  }
}

function _rethrowHttpError(error) {
  if(error.data) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // FIXME: there may be better wrappers already created
    if(error.data.message && error.data.type) {
      throw new Error(
        `${error.data.type}: ${error.data.message}`);
    }
  }
  throw new Error(error.message);
}
