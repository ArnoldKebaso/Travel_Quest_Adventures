// Mock for @middy/http-json-body-parser
const mockJsonBodyParser = () => ({
  before: async (request) => {
    if (request.event.body && typeof request.event.body === 'string') {
      try {
        request.event.body = JSON.parse(request.event.body);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
  }
});

module.exports = mockJsonBodyParser;
module.exports.default = mockJsonBodyParser;
