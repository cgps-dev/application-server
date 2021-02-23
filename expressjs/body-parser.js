const bodyParser = require("body-parser");

// http://stackoverflow.com/a/19965089
module.exports = [
  bodyParser.json({
    limit: "500mb",
  }),
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  }),
];
