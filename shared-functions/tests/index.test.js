var assert = require('assert');
var sharedFunc = require('../index');

const statusCode = 200;
const message = { message: 'Ok' };

describe('The Shared Functions module', () => {
  describe('createResponse', () => {
    describe('should construct an AWS-appropriate response object', () => {
      it('with the given status code', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        assert.strictEqual(response.statusCode, statusCode);
      });
      it('with the given body', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        const responseBody = JSON.parse(response.body);
        assert.strictEqual(responseBody.message, 'Ok');
      });
      it('that is not base64 encoded', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        assert.strictEqual(response.isBase64Encoded, false);
      });
      it('with the appropriate headers', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        assert.strictEqual(response.headers['Access-Control-Allow-Origin'], '*');
      });
    });
  });
});
