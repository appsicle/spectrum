const express = require("express");
const app = express();
const cors = require('cors');
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));
app.use(cors());
// rooms => 
// {room_id: {
//     users: [Users], 
//     unusedPrompts: [Prompt (probably a String)], 
//     round: {
//        started: false,
//        unusedSpeakers: [User],
//        prompt: Prompt,
//        currentUser: User,
//     }
//  }}
var rooms = {};

io.on("connection", (socket) => {
  // user props: id, name, position, avatar
  // enter-room is emitted when a user joins or creates a new room
  socket.on("enter-room", (roomId, user) => {
    console.log(roomId, user);
    // add userId to list of rooms
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        unusedPrompts: [], // todo initialize unused prompts for the room here
        round: {
          started: false,
          unusedSpeakers: [],
          prompt: '',
          currentUser: null,
        }
      };
    }
    rooms[roomId].users.push(user);
    rooms[roomId].round.unusedSpeakers.push(user);

    socket.join(roomId);
    io.in(roomId).emit("user-connected", rooms[roomId]);
    console.log('emit user-connected');
    console.log('roomId: ', roomId);
    console.log("rooms[roomId]: ", rooms[roomId]);

    socket.on("disconnect", () => {
      console.log('disconnect');
      // remove userId from the room
      rooms[roomId].users = rooms[roomId].users.filter((obj) => obj.id !== user.id);
      io.in(roomId).emit("user-disconnected", rooms[roomId]);
    });
  });

  socket.on("update-user", (roomId, user) => {
    // go through each user in the given room
    for (var i = 0; i < rooms[roomId].users.length; i++) {
      // if this is the user we're looking for in the room (matched by ID)
      if (rooms[roomId].users[i].id === user.id) {
        // update this user in the room 
        rooms[roomId].users[i] = user;
        break;
      }
    }

    // emit updated entire rooms[roomId] object
    io.in(roomId).emit("user-updated", rooms[roomId]);
    console.log('user updated: ', rooms[roomId]);
  });

  // start initializes a new round (called at the first start and every 'next question' after)
  socket.on("start", (roomId) => {
    rooms[roomId].round.prompt = "Temporary Prompt"; // todo make this select a random prompt that is in unusedPrompts and remove the selected one from it
    
    const numPossibleSpeakers = rooms[roomId].round.unusedSpeakers.length;
    const index = Math.floor(Math.random()*numPossibleSpeakers);
    const speaker = rooms[roomId].users[index];

    // remove the chosen first speaker from the available speakers
    rooms[roomId].round.unusedSpeakers.splice(index, 1); 

    // set first speaker
    rooms[roomId].round.currentUser = speaker;

    // set round to started
    rooms[roomId].round.started = true;

    // emit round information
    // option to emit rooms[roomId].round but Albert asked for the entire room data for now
    io.in(roomId).emit("round-updated", rooms[roomId]);
    console.log("round updated: ", rooms[roomId]);
    // onResetTimer(roomId); // emit 30 second timer
  });

  socket.on("next-speaker", (roomId) => {
    const numPossibleSpeakers = rooms[rootId].round.unusedSpeakers.length;
    const index = Math.floor(Math.random()*numPossibleSpeakers);
    const speaker = users[index];

    // remove the chosen first speaker from the available speakers
    rooms[roomId].round.unusedSpeakers.splice(index, 1); 

    // set speaker
    rooms[roomId].round.unusedSpeakers = speaker;

    // option to emit rooms[roomId].round but Albert asked for the entire room data for now
    io.in(roomId).emit("round-updated", rooms[roomId]);
  });

});

// // timer that runs for 30 seconds
// function onResetTimer(roomId) {

// }

server.listen(8000, () => {
  console.log("listening on 8000");
});
