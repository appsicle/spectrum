const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));
// clients => 
// {room_id: {
//     users: [Users], 
//     finishedPrompts: [Prompt (probably a String)], 
//     round: {
//        unusedSpeakers: [User],
//        prompt: Prompt,
//        currentUser: User,
//     }
//  }}
var clients = {};

io.on("connection", (socket) => {
  // user props: id, name, position, avatar
  // enter-room is emitted when a user joins or creates a new room
  socket.on("enter-room", (roomId, user) => {
    console.log(roomId, user);
    // add userId to list of connected clients
    if (!clients[roomId]) {
      clients[roomId] = {
        users: [],
        finishedPrompts: [],
        round: {
          unusedSpeakers: [],
          prompt: '',
          currentUser: null,
        }
      };
    }
    clients[roomId][users].push(user);

    socket.join(roomId);
    io.to(roomId).emit("user-connected", user);

    socket.on("disconnect", () => {
      console.log('disconnect');
      io.to(roomId).emit("user-disconnected", user);
      // remove userId to list of connected clients
      clients[roomId][users] = clients[roomId][users].filter((obj) => obj.id !== user.id);
    });
  });

  socket.on("user-updated", (roomId, user) => {
    io.to(roomId).emit("user-updated", user);
  });

  // start emits to all connected sockets a round
  socket.on("start", (roomId) => {
    // all users are available to be the first speaker
    clients[roomId][round][unusedSpeakers] = clients[roomId][users]; 
    clients[roomId][round][prompt] = "Temporary Prompt"; // todo make this select a random prompt that is NOT in finishedPrompts
    
    const numPossibleSpeakers = clients[rootId][round][unusedSpeakers].length;
    const index = Math.floor(Math.random()*numPossibleSpeakers);
    const speaker = users[index];

    // remove the chosen first speaker from the available speakers
    clients[roomId][round][unusedSpeakers].splice(index, 1); 

    // set first speaker
    clients[roomId][round][currentSpeakers] = speaker;

    // emit round information 
    io.to(roomId).emit("round-updated", clients[roomId][round]);
    // onResetTimer(roomId); // emit 30 second timer
  });

  socket.on("next-speaker", (roomId) => {
    const numPossibleSpeakers = clients[rootId][round][unusedSpeakers].length;
    const index = Math.floor(Math.random()*numPossibleSpeakers);
    const speaker = users[index];

    // remove the chosen first speaker from the available speakers
    clients[roomId][round][unusedSpeakers].splice(index, 1); 

    // set speaker
    clients[roomId][round][currentSpeakers] = speaker;
    io.to(roomId).emit("round-updated", clients[roomId][round]);
  });

  socket.on("next-question", (roomId) => {
    clients[roomId][round][prompt] = "Updated Temporary Prompt"; // todo make this select a new random prompt the room hasn't seen before
    io.to(roomId).emit("round-updated", clients[roomId][round]);
  });

});

// // timer that runs for 30 seconds
// function onResetTimer(roomId) {

// }

server.listen(8000, () => {
  console.log("listneing on 8000");
});
