var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var users = require('../index');

describe('The Users API', () => {
  it('should return a 400 when an invalid verb is requested', async () => {
    const event = { httpMethod: 'DELETE' };
    const response = await users.handler(event);
    const responseBody = JSON.parse(response.body);

    assert.equal(response.statusCode, 400);
    assert.equal(responseBody.errorMessage, "Bad request");
  });

  describe('when registering a user', () => {
    it('should do so successfully with a properly given request', async () => {
      const mockAws = {
        CognitoIdentityServiceProvider: () => {
          return {
            signUp: (params) => {
              return {
                promise: async () => { }
              };
            }
          };
        }
      };
      const mockSignUpCall = proxyquire('aws-sdk', mockAws);

      const clientId = 'blah';
      const mockSharedFunc = {
        getEnvironmentConfig: (env) => {
          return {
            cognitoClientId: clientId
          };
        }
      };
      const mockConfigCall = proxyquire('../opt/index', mockSharedFunc);

      const email = 'blah@blah.com';
      const password = 'blah123';

      const testEvent = {
        body: JSON.stringify({
          Email: email,
          Password: password
        }),
        httpMethod: 'POST',
        requestContext: {
          stage: 'Development'
        }
      };

      const response = await users.handler(testEvent);

      assert.ok(response, 'No response was returned');
      assert.equal(response.statusCode, 200, 'statusCode was not 200');
      assert.ok(response.body.successMessage, 'No successMessage was returned');
    });
  });

  afterEach(() => sinon.restore());
});
