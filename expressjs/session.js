const session = require("express-session");
const MongoSessionStore = require("connect-mongo")(session);

module.exports = function (options) {
  return session({
    secret: options.secret,
    store: new MongoSessionStore({ url: options.mongodbUrl }),
    resave: false,
    saveUninitialized: false,
  });
};
