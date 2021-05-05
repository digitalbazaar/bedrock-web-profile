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
    const response = await httpClient.post(
      url, {
        prefixUrl: this.baseURL,
        json: {account, didMethod, didOptions}
      });
    return response.data;
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
    const response = await httpClient.post(
      url, {
        prefixUrl: this.baseURL,
        json: {account, profile, token}
      });
    return response.data;
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
    // this HTTP API returns 204 with no body on success
    await httpClient.post(
      `${url}/${encodeURIComponent(profileAgent)}/claim`, {
        prefixUrl: this.baseURL,
        json: {account}
      });
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
    const response = await httpClient.get(
      url, {
        prefixUrl: this.baseURL,
        searchParams: {account}
      });
    return response.data;
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
    const endpoint = `${url}/${encodeURIComponent(id)}`;
    const response = await httpClient.get(
      endpoint, {
        prefixUrl: this.baseURL,
        searchParams: {account}
      });
    return response.data;
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
    const response = await httpClient.get(
      url, {
        prefixUrl: this.baseURL,
        searchParams: {profile, account}
      });
    if(response.data.length === 0) {
      throw new Error('"profileAgent" not found.');
    }
    return response.data[0];
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
    const endpoint =
      `${url}/${encodeURIComponent(profileAgentId)}/capabilities/delegate`;
    const response = await httpClient.post(
      endpoint, {
        prefixUrl: this.baseURL,
        json: {account, invoker}
      });
    return response.data;
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
    const endpoint = `${url}/${encodeURIComponent(profileAgentId)}` +
      `/capability-set`;
    const response = await httpClient.post(endpoint, {
      prefixUrl: this.baseURL,
      json: {zcaps},
      searchParams: {account}
    });
    return response.status === 204;
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
    }
  }
}
