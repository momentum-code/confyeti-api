const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const AWS = require('aws-sdk');
const sharedFunc = require('../index');

describe('The Shared Functions module', () => {
  describe('createResponse', () => {
    const statusCode = 200;
    const message = {
      message: 'Ok'
    };

    describe('should construct an AWS-appropriate response object', () => {
      it('with the given status code', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        expect(response.statusCode).to.equal(statusCode);
      });
      it('with the given body', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.message).to.equal('Ok');
      });
      it('that is not base64 encoded', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        expect(response.isBase64Encoded).to.be.false;
      });
      it('with the appropriate headers', () => {
        const response = sharedFunc.createResponse(statusCode, message);
        expect(response.headers['Access-Control-Allow-Origin']).to.equal('*');
      });
    });
  });

  describe('getEnvironmentConfig', () => {
    const configMessage = 'Success';
    const mockConfigFound = {
      promise: () => {
        return {
          Item: {
            config: {
              message: configMessage
            }
          }
        };
      }
    };
    const mockConfigMissing = {
      promise: () => {
        return {};
      }
    };
    const goodParams = {
      TableName: 'confyeti-api-config',
      Key: {
        environment: 'Development'
      }
    };
    const badParams = {
      TableName: 'confyeti-api-config',
      Key: {
        environment: 'Blah'
      }
    };
    let awsStub;

    beforeEach(() => {
      awsStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get');
      awsStub.withArgs(goodParams).returns(mockConfigFound);
      awsStub.withArgs(badParams).returns(mockConfigMissing);
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('should return a config record when given a valid environment', async () => {
      const config = await sharedFunc.getEnvironmentConfig('Development');
      expect(config.message).to.equal(configMessage);
    });
    it('should return null when given a invalid environment', async () => {
      const config = await sharedFunc.getEnvironmentConfig('Blah');
      expect(config).to.be.null;
    });
  })
});