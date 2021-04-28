const jwt = require("next-auth/dist/lib/jwt").default;
const getConfig = require("next/config").default;

const requireUserMiddleware = require('./require-user');

module.exports = async function (req, res) {
  const user = await requireUserMiddleware(req, res);

  const { serverRuntimeConfig } = getConfig();

  delete user.image;

  const accessToken = await jwt.encode({
    token: { id: user.id },
    secret: serverRuntimeConfig.secret,
    maxAge: 5 * 365 * 24 * 60 * 60, // 1825 days
  });

  return accessToken;
}
