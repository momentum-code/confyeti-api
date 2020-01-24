const AWS = require('aws-sdk');
const sharedFunc = require('./opt/index');

exports.handler = async (event) => {
  let response = {};

  switch (event.httpMethod) {
    default:
      response = sharedFunc.createResponse(400, { errorMessage: 'Bad request' });
  }
  return response;
};