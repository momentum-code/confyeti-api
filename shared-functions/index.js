const AWS = require('aws-sdk');

module.exports = {
  createResponse: (statusCode, body) => {
    return {
      'statusCode': statusCode,
      'body': JSON.stringify(body),
      'isBase64Encoded': false,
      'headers': {
        'Access-Control-Allow-Origin': '*'
      }
    }
  },
  getEnvironmentConfig: async (environment) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: 'confyeti-api-config',
      Key: {
        environment: `${environment}`
      }
    };

    try {
      const configRecord = await dynamo.get(params).promise();
      if (!configRecord.Item) {
        console.log(`Could not find the config for the ${environment} environment`);
        return null;
      }
      return configRecord.Item.config;
    } catch (error) {
      console.log(`Error retrieving config for the ${environment} environment: ${error}`);
      return null;
    }
  }
}