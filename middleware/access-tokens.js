module.exports = function (options) {
  return (req, res, next) => {
    const token = (req.headers["access-token"] || req.query["access-token"]);
    if (req.user || typeof token !== "string") {
      return next();
    }

    options.getUser(token)
      .then((user) => {
        if (user) {
          req.user = user;
        }
        next();
      })
      .catch(next);
  };
};
