/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import '@bedrock/security-context';
import '@bedrock/https-agent';
import '@bedrock/mongodb';
import '@bedrock/profile';
import '@bedrock/profile-http';
import {passport} from '@bedrock/passport';

passport.authenticate = (strategyName, options, callback) => {
  // eslint-disable-next-line no-unused-vars
  return async function(req, res, next) {
    req._sessionManager = passport._sm;
    req.isAuthenticated = req.isAuthenticated || (() => !!req.user);
    req.login = (user, callback) => {
      req._sessionManager.logIn(req, user, function(err) {
        if(err) {
          req.user = null;
          return callback(err);
        }
        callback();
      });
    };
    const user = {
      account: {id: 'urn:uuid:ffaf5d84-7dc2-4f7b-9825-cc8d2e5a5d06'}
    };
    callback(null, user);
  };
};

import '@bedrock/test';
import '@bedrock/karma';

bedrock.start();
