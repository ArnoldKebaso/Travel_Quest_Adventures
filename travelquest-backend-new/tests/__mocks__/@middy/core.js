// Mock for @middy/core
const mockMiddy = (handler) => {
  const wrappedHandler = async (event, context) => {
    // Parse JSON body if it's a string
    if (event.body && typeof event.body === 'string') {
      try {
        event.body = JSON.parse(event.body);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
    return await handler(event, context);
  };
  
  wrappedHandler.use = () => wrappedHandler;
  
  return wrappedHandler;
};

module.exports = mockMiddy;
module.exports.default = mockMiddy;
