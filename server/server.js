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
  console.log(socket.client.conn.server.clientsCount + " users connected");
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
        unusedPrompts: [...prompts], // initialize unused prompts for the room here
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
      // remove user from the room users list
      rooms[roomId].users = rooms[roomId].users.filter(
        (obj) => obj.id !== user.id
      );
      // if there are no more users in the room, get rid of it
      if (rooms[roomId].users.length === 0) {
        rooms[roomId] = null;
        return;
      }
      rooms[roomId].availableAvatars.push(user.avatar); // readd avatar to available list when user disconnects
      rooms[roomId].round.unusedSpeakers = rooms[roomId].round.unusedSpeakers.filter(
        (obj) => obj.id !== user.id
      ); // remove user from unusedSpeakers in case it is mid round and they haven't spoken yet and are leaving
      rooms[roomId].round.currentUser = popSpeakerFor(roomId); // if the user disconnecting was the currentUser/speaker, set this to be someone new

      io.in(roomId).emit("user-disconnected", {"roomData": rooms[roomId], "userid": user.id});
      console.log("user disconnected: ", {"roomData": rooms[roomId], "userid": user.id});
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
    // set prompt
    rooms[roomId].round.prompt = popPromptFor(roomId);

    // reset unusedSpeaker to hold all users
    rooms[roomId].round.unusedSpeakers = [...rooms[roomId].users]; 
    // set speaker
    rooms[roomId].round.currentUser = popSpeakerFor(roomId);

    // set round to started
    rooms[roomId].round.started = true;

    // reset all user positions to be undecided (position 2)
    resetUserPositionsFor(roomId);

    io.in(roomId).emit("round-updated", rooms[roomId]);
    console.log("round updated from start: ", rooms[roomId]);
  });

  socket.on("next-speaker", (roomId) => {
    // set speaker
    rooms[roomId].round.currentUser = popSpeakerFor(roomId);

    io.in(roomId).emit("round-updated", rooms[roomId]);
    console.log("round updated from next speaker: ", rooms[roomId]);
  });
});

function popPromptFor(roomId) {
  const numPossiblePrompts = rooms[roomId].unusedPrompts.length;
  if (numPossiblePrompts === 0) {
    return "Finished all prompts!"; // can update this message later
  }
  const promptIndex = Math.floor(Math.random() * numPossiblePrompts);
  const prompt = rooms[roomId].unusedPrompts[promptIndex];
  // remove the chosen prompt from the unused prompts
  rooms[roomId].unusedPrompts.splice(promptIndex, 1);
  return prompt;
}

// if next-speaker is accidentally called without an available next speaker, currently breaks
function popSpeakerFor(roomId) {
  const numPossibleSpeakers = rooms[roomId].round.unusedSpeakers.length;
  const speakerIndex = Math.floor(Math.random() * numPossibleSpeakers);
  const speaker = rooms[roomId].round.unusedSpeakers[speakerIndex];
  // remove the chosen speaker from the unused speakers
  rooms[roomId].round.unusedSpeakers.splice(speakerIndex, 1);
  return speaker; 
}

function resetUserPositionsFor(roomId) {
  // reset all user positions to be undecided (position 2)
  for (var i = 0; i < rooms[roomId].users.length; i++) {
    rooms[roomId].users[i].position = 2;
  }
}

server.listen(8000, () => {
  console.log("listening on 8000");
});
