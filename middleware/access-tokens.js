module.exports = function (options) {
  return (req, res, next) => {
    if (!req.user) {
      const token = (req.headers["access-token"] || req.query["access-token"]);
      if (typeof token === "string") {
        options.getUser(token)
          .then((user) => {
            if (user) {
              req.user = user;
            }
            next();
          })
          .catch(next);
      }
    }
    else {
      next();
    }
  };
}
