'use strict';

const assert = require('assert');
const {URL, URLSearchParams} = require('url');
const RestifyClient = require('restify-clients');

class RestApiClient {
  constructor(aConfig) {
    if (typeof aConfig === 'string') {
      assert.doesNotThrow(() => new URL(aConfig));
    } else if(aConfig instanceof Object) {
      assert.doesNotThrow(() => new URL(aConfig.url));
    } else {
      throw new TypeError(aConfig);
    }

    Object.defineProperties(this, {
      client: { value: RestifyClient.createStringClient(aConfig) },
      headers: {
        get: () => this.client.headers,
        enumerable: true
      }
    });
  }

  setHeader(aKey, aValue) {
    this.headers[aKey] = aValue;
    return this;
  }

  static async post(aURL, aBody) {
    const {origin, pathname, search, hash} = new URL(aURL);
    return await new RestApiClient(origin)
      .post(pathname + search + hash, aBody);
  }

  async post(aPath, aBody) {
    let path, body;
    if (aBody instanceof Object) {
      path = {
        path: aPath,
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        }
      };
      body = JSON.stringify(aBody);
    } else if (typeof aBody === 'string') {
      path = {
        path: aPath,
        headers: {
          accept: 'text/plain',
          'content-type': 'text/plain',
        }
      };
      body = aBody;
    } else {
      throw new TypeError(aBody);
    }
    return new Promise((resolve) => {
      this.client.post(path, body, (err, req, res, obj) => {
        assert.ifError(err);
        if (aBody instanceof Object || typeof aBody === 'string') {
          resolve(JSON.parse(obj));
        }
      });
    });
  }

  static async get(aURL, aParam) {
    const {origin, pathname, search, hash} = new URL(aURL);
    return await new RestApiClient(origin)
      .get(pathname + search + hash, aParam);
  }

  async get(aPath, aParam) {
    const searchParam = !aParam ? '' :
      `${~aPath.indexOf('?')?'&':'?'}${new URLSearchParams(aParam).toString()}`;
    return new Promise((resolve) => {
      this.client.get(aPath + searchParam, (err, req, res, obj) => {
        assert.ifError(err);
        resolve(obj);
      });
    });
  }
}

module.exports = RestApiClient;
