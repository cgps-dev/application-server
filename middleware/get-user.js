const { getSession } = require("next-auth/react");
const { ApiError } = require("next/dist/server/api-utils");
const adapter = require("../nextjs/auth/adapter");

async function getUserFromAccessToken(req, res) {
  const accessToken = req.headers["access-token"];

  if (accessToken) {
    const { decode } = require("next-auth/jwt");
    const getConfig = require("next/config").default;
    const { serverRuntimeConfig } = getConfig();

    try {
      const user = await decode({
        secret: serverRuntimeConfig.auth.secret,
        token: accessToken,
        maxAge: 5 * 365 * 24 * 60 * 60, // 1825 days
      });
      const userId = user.id;
      const userDoc = await adapter.getUser(userId);
      return userDoc || undefined;
    }
    catch (err) {
      if (err?.code === "ERR_JWS_VERIFICATION_FAILED") {
        throw new ApiError(403, "Forbidden");
      }
      else {
        throw err;
      }
    }
  }

  return undefined;
}

module.exports = async function getUserMiddleware(req, res) {
  const session = await getSession({ req });

  if (session && session.user) {
    req.user = session.user;
    return session.user;
  }

  const accessTokenUser = await getUserFromAccessToken(req, res);

  if (accessTokenUser) {
    req.user = accessTokenUser;
    return accessTokenUser;
  }

  return undefined;
};
