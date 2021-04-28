const { getSession } = require('next-auth/client');
const { ApiError } = require('next/dist/next-server/server/api-utils');

async function getUserFromAccessToken(req, res) {
  const accessToken = req.headers["access-token"];

  if (accessToken) {
      const jwt = require("next-auth/dist/lib/jwt").default;
      const adapters = require('next-auth/dist/adapters').default;
      const getConfig = require("next/config").default;
      const { serverRuntimeConfig } = getConfig();
  
      try {
      const user = await jwt.decode({
        secret: serverRuntimeConfig.secret,
        token: accessToken,
      });
      const userId = user.id;
      const adapter = adapters.Default(serverRuntimeConfig.auth.database)
      const { getUser } = await adapter.getAdapter({ logger: console });
      const userDoc = await getUser(userId);
      return userDoc || undefined;
    }
    catch (err) {
      if (err?.code === "ERR_JWS_VERIFICATION_FAILED") {
        throw new ApiError(401, "Unauthorized");
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