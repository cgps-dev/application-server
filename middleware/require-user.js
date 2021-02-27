const { getSession } = require('next-auth/client');
const { ApiError } = require('next/dist/next-server/server/api-utils');

module.exports = async function requireUserMiddleware(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    throw new ApiError(401, "Unauthorized");
  }

  return session.user;
}

