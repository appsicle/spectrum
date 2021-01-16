const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  var clients = {};

  // user props: id, name, position, avatar
  // enter-room is emitted when a user joins or creates a new room
  socket.on("enter-room", (roomId, user) => {
    console.log(roomId, user);
    // add userId to list of connected clients
    if (!clients[roomId]) {
      clients[roomId] = [];
    }
    clients[roomId].push(user);

    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", user);

    socket.on("disconnect", () => {
      console.log('disconenxt');
      socket.to(roomId).broadcast.emit("user-disconnected", user);
      // remove userId to list of connected clients
      clients[roomId] = clients[roomId].filter((obj) => obj.id !== user.id);
    });
  });

  socket.on("user-updated", (roomId, user) => {
    socket.to(roomId).broadcast.emit("user-updated", user);
  });

  // broken
  // socket.on('start', (roomId) => {
  //   const users = clients[roomId];
  //   const question = "Temporary prompt that will eventually be randomized"

  //   for(var i = users.length-1;i>=0;i--){
  //     const index = Math.floor(Math.random()*users.length);
  //     const speaker = users[index];
  //     users.splice(index, 1);

  //     socket.to(roomId).broadcast.emit('start', prompt, firstSpeaker, timer);

  //   }
  //   // socket.to(roomId).broadcast.emit('game-started', question, firstSpeaker, timer);
  //   // for each connected client, loop
  // });
});

server.listen(8000, () => {
  console.log("listneing on 8000");
});
