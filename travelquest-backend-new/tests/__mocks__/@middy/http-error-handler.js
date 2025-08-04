// Mock for @middy/http-error-handler
const mockErrorHandler = () => ({
  onError: async (request) => {
    const error = request.error;
    const statusCode = error.statusCode || 500;
    
    request.response = {
      statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message || 'Internal Server Error'
      })
    };
  }
});

module.exports = mockErrorHandler;
module.exports.default = mockErrorHandler;
