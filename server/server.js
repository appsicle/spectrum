const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const prompts = require("./prompts.js");

app.use(express.static("public"));
app.use(cors());
const avatarsUrl = 'https://spectrum-avatars.s3-us-west-1.amazonaws.com';
const rooms = {};

io.on("connection", (socket) => {
  // user props: id, name, position, avatar
  // enter-room is emitted when a user joins or creates a new room
  socket.on("enter-room", (roomId, user) => {
    // if this room doesn't exist, initialize it
    if (!rooms[roomId]) {
      // make set of avatars available for the room temp 10 random images
      const avatars = [
        avatarsUrl+'/beaver.png',
        avatarsUrl+'/cat.png',
        avatarsUrl+'/corn.png',
        avatarsUrl+'/dog.png',
        avatarsUrl+'/peach.png',
        avatarsUrl+'/rabbit.png',
        avatarsUrl+'/sacrifice.png',
        avatarsUrl+'/koala.png',
        avatarsUrl+'/macaw.png',
        avatarsUrl+'/turkey.png',
      ];
      rooms[roomId] = {
        availableAvatars: avatars,
        users: [],
        unusedPrompts: prompts, // initialize unused prompts for the room here
        round: {
          started: false,
          unusedSpeakers: [],
          prompt: "",
          currentUser: null,
        },
      };
    }

    // add random avatar to user before using
    const numAvailAvatars = rooms[roomId].availableAvatars.length;
    const avatarIndex = Math.floor(Math.random() * numAvailAvatars);
    const avatar = rooms[roomId].availableAvatars[avatarIndex];
    rooms[roomId].availableAvatars.splice(avatarIndex, 1);
    user.avatar = avatar;

    rooms[roomId].users.push(user);

    socket.join(roomId);
    io.in(roomId).emit("user-connected", rooms[roomId]);
    console.log("user connected: ", rooms[roomId]);

    socket.on("disconnect", () => {
      // remove user from the room
      rooms[roomId].users = rooms[roomId].users.filter(
        (obj) => obj.id !== user.id
      );
      io.in(roomId).emit("user-disconnected", rooms[roomId]);
      console.log("user disconnected: ", rooms[roomId]);
    });
  });

  socket.on("update-user", (roomId, user) => {
    // go through each user in the given room
    for (let i = 0; i < rooms[roomId].users.length; i++) {
      // if this is the user we're looking for in the room (matched by ID)
      if (rooms[roomId].users[i].id === user.id) {
        // update this user in the room
        rooms[roomId].users[i] = user;
        break;
      }
    }

    io.in(roomId).emit("user-updated", rooms[roomId]);
    console.log("user updated: ", rooms[roomId]);
  });

  // start initializes a new round (called at the first start and every 'next question' after)
  socket.on("start", (roomId) => {
    const numPossiblePrompts = rooms[roomId].unusedPrompts.length;
    const promptIndex = Math.floor(Math.random() * numPossiblePrompts);
    const prompt = rooms[roomId].unusedPrompts[promptIndex];
    // remove the chosen prompt from the unused prompts
    console.log(rooms[roomId].unusedPrompts)
    rooms[roomId].unusedPrompts.splice(promptIndex, 1);
    // set prompt
    rooms[roomId].round.prompt = prompt;

    rooms[roomId].round.unusedSpeakers = [...rooms[roomId].users]; // reset unusedSpeaker to hold all users
    const numPossibleSpeakers = rooms[roomId].round.unusedSpeakers.length;
    const speakerIndex = Math.floor(Math.random() * numPossibleSpeakers);
    const speaker = rooms[roomId].round.unusedSpeakers[speakerIndex];
    // remove the chosen speaker from the unused speakers
    rooms[roomId].round.unusedSpeakers.splice(speakerIndex, 1);
    console.log("unused speakers: ", rooms[roomId].round.unusedSpeakers);
    // set speaker
    rooms[roomId].round.currentUser = speaker;

    // set round to started
    rooms[roomId].round.started = true;

    // emit round information
    io.in(roomId).emit("round-updated", rooms[roomId]);
    console.log("round updated: ", rooms[roomId]);
    // onResetTimer(roomId); // emit 30 second timer
  });

  socket.on("next-speaker", (roomId) => {
    const numPossibleSpeakers = rooms[rootId].round.unusedSpeakers.length;
    const index = Math.floor(Math.random() * numPossibleSpeakers);
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
