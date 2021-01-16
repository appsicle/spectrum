const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));
// rooms => 
// {room_id: {
//     users: [Users], 
//     unusedPrompts: [Prompt (probably a String)], 
//     round: {
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
        unusedPrompts: [],
        round: {
          unusedSpeakers: [],
          prompt: '',
          currentUser: null,
        }
      };
    }
    rooms[roomId].users.push(user);

    socket.join(roomId);
    io.to(roomId).emit("user-connected", rooms[roomId]);

    socket.on("disconnect", () => {
      console.log('disconnect');
      // remove userId from the room
      rooms[roomId].users = rooms[roomId].users.filter((obj) => obj.id !== user.id);
      io.to(roomId).emit("user-disconnected", rooms[roomId]);
    });
  });

  socket.on("update-user", (roomId, user) => {
    // go through each user in the given room
    for (var i = 0; i < rooms[roomId].users.length; i++) {
      // if this is the user we're looking for in the room (matched by ID)
      if (rooms[roomId].users[i].userId === user.userId) {
        // update this user in the room 
        rooms[roomId].users[i] = user;
        break;
      }
    }

    // emit updated entire rooms[roomId] object
    io.to(roomId).emit("user-updated", rooms[roomId]);
  });

  // unfinished
  // start begins the ice breaker for the first round, initializing the round
  // can possibly be condensed into functions for code reuse in other places but i'm dead right now
  socket.on("start", (roomId) => {
    // all users are available to be the first speaker
    rooms[roomId].round.unusedSpeakers = rooms[roomId].users; 
    rooms[roomId].round.prompt = "Temporary Prompt"; // todo make this select a random prompt that is in unusedPrompts
    
    const numPossibleSpeakers = rooms[rootId].round.unusedSpeakers.length;
    const index = Math.floor(Math.random()*numPossibleSpeakers);
    const speaker = users[index];

    // remove the chosen first speaker from the available speakers
    rooms[roomId].round.unusedSpeakers.splice(index, 1); 

    // set first speaker
    rooms[roomId].round.unusedSpeakers = speaker;

    // emit round information
    // option to emit rooms[roomId].round but Albert asked for the entire room data for now
    io.to(roomId).emit("round-updated", rooms[roomId]);
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
    io.to(roomId).emit("round-updated", rooms[roomId]);
  });

  // unfinished
  socket.on("next-prompt", (roomId) => {
    // todo make this select a new prompt from unusedPrompts
    // remove the chosen from the rooms[roomId].unusedPrompts
    rooms[roomId].round.prompt = "Updated Temporary Prompt";
    io.to(roomId).emit("round-updated", rooms[roomId].round);
  });

});

// // timer that runs for 30 seconds
// function onResetTimer(roomId) {

// }

server.listen(8000, () => {
  console.log("listneing on 8000");
});
