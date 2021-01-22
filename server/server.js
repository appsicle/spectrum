const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const defaultPrompts = require("./prompts.js");
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(cors());
const avatarsUrl = 'https://spectrum-avatars.s3-us-west-1.amazonaws.com';
// current issue: the rooms that is being changed by the endpoints is not updating for the socket
var rooms = {}; 
var socketToRoom = {};

app.post('/createRoom', jsonParser, function (req,res){
  const {roomId, customPrompts} = req.body;
  if (rooms[roomId]) {
    // should be an error because a user tried to create a room with an existing ID
    console.log('error - a room with this id already exists');
    res.status(400).json({
      message: 'Cannot create a room already exists.'
    })
  } 

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
    unusedPrompts: customPrompts ? customPrompts : [...defaultPrompts], 
    finishedActivity: false, // to be used on the frontend to know when room has gone through all prompts
    round: {
      started: false,
      unusedSpeakers: [],
      prompt: "",
      currentUser: null,
    },
  };
  
  res.status(200).send();
});

app.get('/joinRoom', jsonParser, function (req,res){
  const {roomId} = req.body;
  // if this room doesn't exist, initialize it
  if (!rooms[roomId]) {
    // should return an error because the user tried to join a room that doesn't exist
    console.log('error - this room does not exist');
    res.status(400).json({
      message: 'Cannot join a room that does not exist.'
    })
  } 
  
  res.status(200).send();
});

io.on("connection", (socket) => {
  console.log(socket.client.conn.server.clientsCount + " users connected");

  // enter-room is emitted when a user joins a room
  socket.on("enter-room", (roomId, user) => {
    console.log("inside enter room ", roomId);
    console.log("in enter room", rooms[roomId]);
    // add random avatar to user before using
    const numAvailAvatars = rooms[roomId].availableAvatars.length;
    const avatarIndex = Math.floor(Math.random() * numAvailAvatars);
    const avatar = rooms[roomId].availableAvatars[avatarIndex];
    rooms[roomId].availableAvatars.splice(avatarIndex, 1);
    user.avatar = avatar;
    user.socketId = socket.id; // need this to know what socket disconnected on the backend

    rooms[roomId].users.push(user);

    socket.join(roomId);
    io.in(roomId).emit("user-connected", rooms[roomId]);
    console.log("user connected: ", rooms[roomId]);
  });

  socket.on("disconnect", () => {
    const roomId = socketToRoom[socket.socketId];
    if (!roomId) {
      // if user disconnected befor entering a room, don't do anything
      return;
    }

    // find the user we are disconnecting based on the socket's id
    var disconnectingUser = null;
    for (var i = 0; i < rooms[roomId].users.length; i++) {
      if (rooms[roomId].users[i].socketId === socket.socketId) {
        disconnectingUser = rooms[roomId].users[i];
      }
    }

    // remove user from the room users list
    rooms[roomId].users = rooms[roomId].users.filter(
      (obj) => obj.id !== disconnectingUser.id
    );

    // if there are no more users in the room, get rid of it 
    if (rooms[roomId].users.length === 0) {
      rooms[roomId] = null;
      return;
    }

    rooms[roomId].availableAvatars.push(disconnectingUser.avatar); // readd avatar to available list when user disconnects
    rooms[roomId].round.unusedSpeakers = rooms[roomId].round.unusedSpeakers.filter(
      (obj) => obj.id !== disconnectingUser.id
    ); // remove user from unusedSpeakers in case it is mid round and they haven't spoken yet and are leaving
    
     // if the user disconnecting was the currentUser/speaker, set this to be someone new
    if (rooms[roomId].round.currentUser.id === disconnectingUser.id) {
      rooms[romoId].round.currentUser.id = popSpeakerFor(roomId);
    } 

    // remove this socket from our socketToRoom map
    socketToRoom[socket.socketId] = null;
  
    io.in(roomId).emit("user-disconnected", {"roomData": rooms[roomId], "userid": disconnectingUser.id});
    console.log("user disconnected: ", {"roomData": rooms[roomId], "userid": disconnectingUser.id});
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
    rooms[roomId].finishedActivity = true;
    return "You've finished all prompts! Hope you enjoyed Spectrum :)"; // can update this message later
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
