const AWS = require('aws-sdk');
const sharedFunc = require('./opt/index');
const config = require('./config.json');

exports.handler = async (event) => {
  let response = {};

  switch (event.httpMethod) {
    case 'GET':
      response = sharedFunc.createResponse(200, { successMessage: 'Way to go!' });
      break;
    case 'POST':
      response = await registerUser(event);
      break
    default:
      response = sharedFunc.createResponse(400, { errorMessage: 'Bad request!' });
  }
  return response;
};

async function registerUser(event) {
  const body = JSON.parse(event.body);

  var params = {
    ClientId: config.develop.cognitoClientId,
    Password: body.Password,
    Username: body.Email
  };

  await callSignUp(params);

  return sharedFunc.createResponse(200, { successMessage: 'User registered, email sent' });
}

async function callSignUp(params) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  return await cognitoidentityserviceprovider.signUp(params).promise();
}
