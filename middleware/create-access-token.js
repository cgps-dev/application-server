const jwt = require("next-auth/dist/lib/jwt").default;
const getConfig = require("next/config").default;

const requireUserMiddleware = require('./require-user');

module.exports = async function (req, res) {
  const user = await requireUserMiddleware(req, res);

  const { serverRuntimeConfig } = getConfig();

  const accessToken = await jwt.encode({
    token: user,
    secret: serverRuntimeConfig.secret,
  });

  return accessToken;
}
