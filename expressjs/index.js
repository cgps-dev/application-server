const express = require("express");

const app = express();

app.use(require("./body-parser"));

app.use(require("./cookie-parser"));

app.use(require("./session"));

app.use(require("./db"));

app.use(require("./auth"));

app.use(require("./access-token-middleware"));

module.exports = app;
