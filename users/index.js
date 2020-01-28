const AWS = require('aws-sdk');
const sharedFunc = require('./opt/index');

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
      response = sharedFunc.createResponse(400, { errorMessage: 'Bad request' });
  }
  return response;
};

async function registerUser(event) {
  const body = JSON.parse(event.body);

  try {
    const environment = event.requestContext.stage || 'Development';
    const config = await sharedFunc.getEnvironmentConfig(environment);

    var params = {
      ClientId: config.cognitoClientId,
      Password: body.Password,
      Username: body.Email
    };

    await callSignUp(params);

    return sharedFunc.createResponse(200, { successMessage: 'User registered, email sent' });
  } catch (error) {
    console.log(`User registration failed for ${body.Email}`);
    return sharedFunc.createResponse(500, { errorMessage: 'Internal server error' });
  }
}

async function callSignUp(params) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  return await cognitoidentityserviceprovider.signUp(params).promise();
}
