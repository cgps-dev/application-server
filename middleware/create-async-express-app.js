const express = require("express");

// const { addAsync } = require("@awaitjs/express");

// const expressRouter = express.Router;
// express.Router = function asyncRouter() {
//   // eslint-disable-next-line prefer-rest-params
//   return addAsync(expressRouter.apply(express, arguments));
// };

// const app = addAsync(express());
const app = express();

module.exports = app;
