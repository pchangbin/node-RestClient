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
    it('send/receive JSON object', async function() {
      const body = {foo:'hello', bar:'world'};
      const {json} = await client.post(path, body);
      assert.deepEqual(body, json);
    });
    it('send/receive string', async function() {
      const body = 'Hello world!';
      const {data} = await client.post(path, body);
      assert.strictEqual(body, data);
    });

  });

  describe('get', function() {
    it('pass given object as search parameters', async function() {
      const params = {
        foo: 'hello',
        bar: 'world',
      };
      const resp = JSON.parse(await client.get('/get', params));
      assert.deepEqual(params, resp.args);
    });

    it('merges search parameters in aPath and given parameter as object',
      async function() {
        const params = {
          foo: 'hello',
          bar: 'world',
        };
        const resp = JSON.parse(await client.get('/get?baz', params));
        assert.strictEqual(resp.args.foo, params.foo);
        assert.strictEqual(resp.args.bar, params.bar);
        assert.strictEqual(resp.args.baz, '');
      });
  });
});

describe('Static method', function() {
  describe('post', function() {
    const full_url = `${url}/post`;
    it('send/receive JSON object', async function() {
      const body = {foo:'hello', bar:'world'};
      const {json} = await RestApiClient.post(full_url, body);
      assert.deepEqual(body, json);
    });
  });

  describe('get', function() {
    it('pass given object as search parameters', async function() {
      const params = {
        foo: 'hello',
        bar: 'world',
      };
      const resp = JSON.parse(await RestApiClient.get(`${url}/get`, params));
      assert.deepEqual(params, resp.args);
    });
  });
});
