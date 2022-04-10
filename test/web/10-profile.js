/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {ProfileService} from '@bedrock/web-profile';

const profileService = new ProfileService();

describe('profile API', () => {
  describe('create API', () => {
    describe('authenticated request', () => {
      it('does something incorrectly', async () => {
        let result;
        let err;
        try {
          result = await profileService.create();
        } catch(e) {
          err = e;
        }
        should.not.exist(result);
        should.exist(err);
      });
    }); // end authenticated request
  }); // end create
});
