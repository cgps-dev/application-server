const path = require("path");

const signin = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/signin")).default;
const signout = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/signout")).default;
const verifyRequest = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/verify-request")).default;
const error = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/error")).default;
const css = require(path.join(process.cwd(), "node_modules/next-auth/dist/css/index"));
const renderPageModule = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/index.js"));

renderPageModule.default = (req, res) => {
  const { baseUrl, basePath, callbackUrl, csrfToken, providers, theme } = req.options;

  res.setHeader("Content-Type", "text/html");
  function send(html) {
    res.send(`<!DOCTYPE html><head><style type="text/css">${css()}</style><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles/nextjs-auth-page.css" /></head><body class="__next-auth-theme-${theme}"><div class="page">${html}</div></body></html>`);
  }

  return {
    signin(props) { send(signin({ csrfToken, providers, callbackUrl, ...req.query, ...props })); },
    signout(props) { send(signout({ csrfToken, baseUrl, basePath, ...props })); },
    verifyRequest(props) { send(verifyRequest({ baseUrl, ...props })); },
    error(props) { send(error({ basePath, baseUrl, res, ...props })); },
  };
};

module.exports = function() {};
