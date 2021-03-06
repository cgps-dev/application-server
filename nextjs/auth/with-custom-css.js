const path = require("path");
const renderToString = require("preact-render-to-string");

const signin = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/signin")).default;
const signout = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/signout")).default;
const verifyRequest = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/verify-request")).default;
const error = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/error")).default;
const css = require(path.join(process.cwd(), "node_modules/next-auth/dist/css/index"));
const renderPageModule = require(path.join(process.cwd(), "node_modules/next-auth/dist/server/pages/index.js"));

renderPageModule.default = (req, res) => {
  const { baseUrl, basePath, callbackUrl, csrfToken, providers, theme } = req.options

  res.setHeader('Content-Type', 'text/html')
  function send ({ html, title }) {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css()}</style><link rel="stylesheet" href="/styles/nextjs-auth-page.css" /><title>${title}</title></head><body class="__next-auth-theme-${theme}"><div class="page">${renderToString(html)}</div></body></html>`)
  }

  return {
    signin (props) {
      send({
        html: signin({ csrfToken, providers, callbackUrl, ...req.query, ...props }),
        title: 'Sign In'
      })
    },
    signout (props) {
      send({
        html: signout({ csrfToken, baseUrl, basePath, ...props }),
        title: 'Sign Out'
      })
    },
    verifyRequest (props) {
      send({
        html: verifyRequest({ baseUrl, ...props }),
        title: 'Verify Request'
      })
    },
    error (props) {
      send({
        html: error({ basePath, baseUrl, res, ...props }),
        title: 'Error'
      })
    }
  }
}

module.exports = function() {};
