const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const AWS = require('aws-sdk');
const sharedFunc = require('../opt/index');
const users = require('../index');

describe('The Users API', () => {
  const cognitoId = 'Abc123';
  const email = 'joe@aol.com';
  const password = 'CupOfJoe';
  const mockParams = {
    ClientId: cognitoId,
    Password: password,
    Username: email
  }
  let validRequest;
  let invalidRequest;
  let signUpSpy;

  beforeEach(() => {
    const goodEnv = 'QA';
    const badEnv = 'Bad';
    const sharedFuncMock = sandbox.stub(sharedFunc, 'getEnvironmentConfig');
    sharedFuncMock.withArgs(goodEnv).returns({ cognitoClientId: cognitoId });
    sharedFuncMock.withArgs(badEnv).throws('FakeError');

    const mockSignUp = {
      signUp: (params) => {
        return {
          promise: () => {
            return Promise.resolve({});
          }
        }
      }
    };
    const awsMock = sandbox.stub(AWS, 'CognitoIdentityServiceProvider').returns(mockSignUp);
    signUpSpy = sinon.spy(mockSignUp, 'signUp');

    validRequest = {
      'httpMethod': 'POST',
      'body': JSON.stringify({
        'Email': email,
        'Password': password
      }),
      'requestContext': {
        'stage': goodEnv
      }
    };
    invalidRequest = { ...validRequest, 'requestContext': { 'stage': badEnv } };
  });

  afterEach(() => sandbox.restore());

  describe('when an invalid verb is requested', () => {
    it('should return a 400 and an error message', async () => {
      const request = { httpMethod: 'DELETE' };
      const response = await users.handler(request);
      const responseBody = JSON.parse(response.body);

      expect(response.statusCode).to.equal(400);
      expect(responseBody.errorMessage).to.equal('Bad request');
    });
  });

  describe('when called with a valid POST request', () => {
    it('should return an successful status code and message', async () => {
      const response = await users.handler(validRequest);
      const responseBody = JSON.parse(response.body);

      expect(signUpSpy.calledWith(mockParams), 'callSignUp was not called with the expected parameters').to.be.true;
      expect(response.statusCode).to.equal(200);
      expect(responseBody.successMessage).to.equal('User registered, email sent');
    });
  });

  describe('when called with an invalid POST request', () => {
    it('should return an internal server error status code and an error message', async () => {
      const response = await users.handler(invalidRequest);
      const responseBody = JSON.parse(response.body);

      expect(response.statusCode).to.equal(500);
      expect(responseBody.errorMessage).to.equal('Internal server error');
    });
  })
});
