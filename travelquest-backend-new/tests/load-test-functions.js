// Load testing helper functions
module.exports = {
  setAuthHeaders: function(requestParams, context, ee, next) {
    requestParams.headers = requestParams.headers || {};
    requestParams.headers['Authorization'] = 'Bearer fake-token-for-load-testing';
    requestParams.headers['Content-Type'] = 'application/json';
    return next();
  },
  
  logResponse: function(requestParams, response, context, ee, next) {
    console.log(`Response time: ${response.timings.phases.total}ms`);
    return next();
  },
  
  validateResponse: function(requestParams, response, context, ee, next) {
    if (response.statusCode >= 400) {
      console.error(`Error response: ${response.statusCode} - ${response.body}`);
    }
    return next();
  }
};
