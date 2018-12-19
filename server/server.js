require("./config/config");

const path = require("path");
const _ = require("lodash");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");

const { authenticate } = require("./middleware/authenticate");
const { logging } = require("./middleware/logging");
const { createMessage, createLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "../public");

console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var usersList = new Users();

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("join", (params, callback) => {
    var name = params.name;
    var room = params.room;

    if (!isRealString(name) || !isRealString(room)) {
      return callback("Name and room name are required.");
    }

    socket.join(room);

    usersList.removeUser(socket.id);
    usersList.addUser(socket.id, name, room);
    io.to(room).emit("updateUserList", usersList.getUserList(room));

    socket.emit("newMessage", createMessage("Admin", `Welcome ${name}`));
    socket.broadcast
      .to(room)
      .emit("newMessage", createMessage("Admin", `${name} joined the room`));
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    console.log("Create new message", message);
    // io.emit("newMessage", message);
    socket.broadcast.emit(
      "newMessage",
      createMessage(message.from, message.text)
    );
    callback !== undefined && callback("success");
  });

  socket.on("createLocationMessage", (coords, callback) => {
    console.log("Create new location message", coords);
    // io.emit("newMessage", message);
    socket.broadcast.emit(
      "newLocationMessage",
      createLocationMessage("Admin", coords.latitude, coords.longitude)
    );
    callback !== undefined && callback("success");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from client");
    var user = usersList.removeUser(socket.id);
    io.to(user.room).emit('updateUserList', usersList.getUserList(user.room));
    io.to(user.room).emit('newMessage', createMessage('Admin', `${user.name} has left the room.`));
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
