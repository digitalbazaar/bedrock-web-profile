/*!
 * Copyright (c) 2020-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {httpClient} from '@digitalbazaar/http-client';

/**
 * @param {object} [config = {urls: {base: '/profiles'}}] - The config options.
 * @param {string} [config.baseURL] - Protocol, host & port used with Node.js
 *   such as https://example.com.
 * @param {object} [config.urls = {}]
 * @param {string} [config.urls.base = '/profiles']
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
    if(this.baseURL) {
      url = new URL(url, this.baseURL).toString();
    }
    const response = await httpClient.post(
      url, {
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
    if(this.baseURL) {
      url = new URL(url, this.baseURL).toString();
    }
    const response = await httpClient.post(
      url, {
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
    if(this.baseURL) {
      url = new URL(url, this.baseURL).toString();
    }
    // this HTTP API returns 204 with no body on success
    await httpClient.post(
      `${url}/${encodeURIComponent(profileAgent)}/claim`, {
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
    if(this.baseURL) {
      url = new URL(url, this.baseURL).toString();
    }
    const response = await httpClient.get(
      url, {
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
    let endpoint = `${url}/${encodeURIComponent(id)}`;
    if(this.baseURL) {
      endpoint = new URL(endpoint, this.baseURL).toString();
    }
    const response = await httpClient.get(
      endpoint, {
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
      let endpoint = `${url}/${encodeURIComponent(id)}`;
      if(this.baseURL) {
        endpoint = new URL(endpoint, this.baseURL).toString();
      }
      const response = await httpClient.delete(
        endpoint, {
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
    if(this.baseURL) {
      url = new URL(url, this.baseURL).toString();
    }
    const response = await httpClient.get(
      url, {
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
   * @param {string} options.controller - The controller to delegate the
   *   capability to.
   * @param {object} options.zcap - The capability to delegate.
   *
   * @returns {Promise} Resolves when the operation completes.
   */
  async delegateAgentCapability({
    url = this.config.urls.profileAgents,
    profileAgentId, account, controller, zcap
  } = {}) {
    let endpoint =
      `${url}/${encodeURIComponent(profileAgentId)}/capabilities/delegate`;
    if(this.baseURL) {
      endpoint = new URL(endpoint, this.baseURL).toString();
    }
    const response = await httpClient.post(
      endpoint, {
        json: {account, controller, zcap}
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
    let endpoint = `${url}/${encodeURIComponent(profileAgentId)}` +
      `/capability-set`;
    if(this.baseURL) {
      endpoint = new URL(endpoint, this.baseURL).toString();
    }
    const response = await httpClient.post(endpoint, {
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
      let endpoint = `${url}/${encodeURIComponent(profileAgentId)}` +
        `/capability-set`;
      if(this.baseURL) {
        endpoint = new URL(endpoint, this.baseURL).toString();
      }
      const response = await httpClient.delete(
        endpoint, {
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
