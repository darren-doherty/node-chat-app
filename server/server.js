require("./config/config");

const path = require('path');
const _ = require("lodash");
const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require("body-parser");

const { authenticate } = require("./middleware/authenticate");
const { logging } = require("./middleware/logging");

const publicPath = path.join(__dirname, '../public');

console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
      console.log('Disconnected from client');
  });
});

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(logging);
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports = { app };
