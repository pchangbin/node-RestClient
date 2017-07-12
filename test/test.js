'use strict';

const assert = require('assert');

const RestApiClient = require('..');

const url = 'http://httpbin.org';

describe('Instantication', function() {
  describe('works with', function() {
    it('url only', function() {
      assert.doesNotThrow(() => new RestApiClient(url));
    });
    it('object with url property', function() {
      assert.doesNotThrow(() => new RestApiClient({url}));
    });
  });
  describe('fails with', function() {
    it('no parameter for constructor', function() {
      assert.throws(() => new RestApiClient());
    });
  });
});

describe('RestApiClient method', function() {
  this.timeout(5000);

  let client;
  before(`Create client for ${url}`, function() {
    client = new RestApiClient({url});
  });

  describe('post', function() {
    const path = '/post';
    it('JSON', async function() {
      const body = {foo:'hello', bar:'world'};
      const json = await client.post(path, body);
      assert.deepEqual(body, json);
    });
    it('String', async function() {
      const body = 'Hello world!';
      const data = await client.post(path, body);
      assert.strictEqual(body, data);
    });

  });
});
