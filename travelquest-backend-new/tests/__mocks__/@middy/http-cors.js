// Mock for @middy/http-cors
const mockCors = () => ({
  after: async (request) => {
    if (!request.response.headers) {
      request.response.headers = {};
    }
    request.response.headers['Access-Control-Allow-Origin'] = '*';
    request.response.headers['Access-Control-Allow-Credentials'] = 'true';
    request.response.headers['Access-Control-Allow-Headers'] = 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token';
    request.response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
  }
});

module.exports = mockCors;
module.exports.default = mockCors;
