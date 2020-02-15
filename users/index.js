const AWS = require('aws-sdk');
const sharedFunc = require('./opt/index');

exports.handler = async (request) => {
  let response = {};

  switch (request.httpMethod) {
    case 'POST':
      response = await registerUser(request);
      break
    default:
      response = sharedFunc.createResponse(400, { errorMessage: 'Bad request' });
  }
  return response;
};

async function registerUser(request) {
  const body = JSON.parse(request.body);

  try {
    const environment = request.requestContext.stage || 'Development';
    const config = await sharedFunc.getEnvironmentConfig(environment);

    var params = {
      ClientId: config.cognitoClientId,
      Password: body.Password,
      Username: body.Email
    };

    await callSignUp(params);

    return sharedFunc.createResponse(200, { successMessage: 'User registered, email sent' });
  } catch (error) {
    console.log(`User registration failed for ${body.Email}: ${error}`);
    return sharedFunc.createResponse(500, { errorMessage: 'Internal server error' });
  }
}

async function callSignUp(params) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  return await cognitoidentityserviceprovider.signUp(params).promise();
}
