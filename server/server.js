require("./config/config");

const path = require("path");
const _ = require("lodash");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");

const { authenticate } = require("./middleware/authenticate");
const { logging } = require("./middleware/logging");

const publicPath = path.join(__dirname, "../public");

console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on("connection", socket => {
  console.log("New user connected");

  socket.emit("newMessage", {
    from: 'Admin',
    text: 'Welcome',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit("newMessage",  {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  socket.on("createMessage", message => {
    console.log("Create new message", message);

    message.createdAt = new Date().getTime();
    // io.emit("newMessage", message);
    socket.broadcast.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from client");
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
