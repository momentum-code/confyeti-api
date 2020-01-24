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
  }
}