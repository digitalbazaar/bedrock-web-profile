/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from '@bedrock/core';
import path from 'path';
import '@bedrock/https-agent';
import '@bedrock/karma';
import '@bedrock/mongodb';

config.karma.suites['bedrock-web-profile'] = path.join('web', '**', '*.js');

config.karma.config.proxies = {
  '/': 'https://localhost:18443'
};
config.karma.config.proxyValidateSSL = false;

// mongodb config
config.mongodb.name = 'bedrock_web_profile_test';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
// drop all collections on initialization
config.mongodb.dropCollections = {};
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

// allow self-signed certs in test framework
config['https-agent'].rejectUnauthorized = false;
