const { getSession } = require("next-auth/client");
const { ApiError } = require("next/dist/next-server/server/api-utils");

const getDatabaseAdapter = require("../nextjs/auth/get-database-adapter");

async function getUserFromAccessToken(req, res) {
  const accessToken = req.headers["access-token"];

  if (accessToken) {
    const jwt = require("next-auth/jwt").default;
    const getConfig = require("next/config").default;
    const { serverRuntimeConfig } = getConfig();

    try {
      const user = await jwt.decode({
        secret: serverRuntimeConfig.auth.secret,
        token: accessToken,
        maxAge: 5 * 365 * 24 * 60 * 60, // 1825 days
      });
      const userId = user.id;
      const adapter = await getDatabaseAdapter();
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
    return session.user;
  }

  const accessTokenUser = await getUserFromAccessToken(req, res);

  if (accessTokenUser) {
    return accessTokenUser;
  }  

  return undefined;
}