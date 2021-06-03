module.exports = async function getDatabaseAdapter(req, res) {
  const adapters = require("next-auth/adapters").default;
  const getConfig = require("next/config").default;
  const { serverRuntimeConfig } = getConfig();
  const adapter = adapters.Default(serverRuntimeConfig.auth.database)
  const dbAdapter = await adapter.getAdapter({ logger: console });
  return dbAdapter;
}
