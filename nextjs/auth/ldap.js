/* eslint-disable new-cap */

const Providers = require("next-auth/dist/providers").default;
const LdapAuth = require("ldapauth-fork");

const getDatabaseAdapter = require('./get-database-adapter');

function login(config, credentials) {
  const client = new LdapAuth(config);

  return new Promise((resolve) => {
    client.authenticate(
      credentials.username,
      credentials.password,
      (error, profile) => {
        if (error) {
          console.error(error);
          resolve(null);
        }
        else {
          resolve(profile);
        }
      },
    );
  });
}

module.exports = function(options) {
  const config = {
    name: "LDAP",
    session: false,
    usernameField: "username",
    passwordField: "password",
    url: "ldap://localhost:389",
    bindDn: "cn=root",
    bindCredentials: "secret",
    searchBase: "ou=passport-ldapauth",
    searchFilter: "(uid={{username}})",
    searchAttributes: undefined,
    ...options,
  };

  return Providers.Credentials(
    {
      name: config.name,
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Essentially promisify the LDAPJS client.bind function
        const profile = await login(config, credentials);

        if (profile === null) {
          return null;
        }

        const adapter = await getDatabaseAdapter();
        const email = profile[config.emailAttribute || "mail"];
        const uid = profile[config.idAttribute || "uid"];
        const name = profile[config.nameAttribute || "displayName"];

        const userDoc = await adapter.getUserByEmail(email);
        if (userDoc) {
          userDoc.name = uid;
          userDoc.name = name;
          return userDoc;
        }

        return adapter.createUser({
          email,
          uid,
          name,
        });
      },
    }
  );
};
