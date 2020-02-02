var assert = require('assert');
var users = require('../index');

describe('The Users API', () => {
  it('should return a 400 when an invalid verb is requested', async () => {
    const event = { httpMethod: 'DELETE' };
    const response = await users.handler(event);
    const responseBody = JSON.parse(response.body);

    assert.equal(response.statusCode, 400);
    assert.equal(responseBody.errorMessage, "Bad request");
  });
});
