const { getSession } = require('next-auth/client');

module.exports = async function getUserMiddleware(req, res) {
  const session = await getSession({ req });

  if (session && session.user) {
    return session.user;
  }
  else {
    return undefined;
  }
}