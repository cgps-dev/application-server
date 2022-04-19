const util = require('util');

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
module.exports = function initMiddleware(middleware) {
  const promise = util.promisify(middleware);
  return async (req, res) => {
    const result = await promise(req, res);

    if (result instanceof Error) {
      throw(result);
    }
    
    return result;
  };
}
