require("./config/config");

const path = require('path');
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");

const { authenticate } = require("./middleware/authenticate");
const { logging } = require("./middleware/logging");

const publicPath = path.join(__dirname, '../public');

console.log(publicPath);

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(logging);
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports = { app };
