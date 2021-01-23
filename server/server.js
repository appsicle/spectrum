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
  const {roomName, customPrompts} = req.body;
  if (rooms[roomName]) {
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

  rooms[roomName] = {
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

app.post('/joinRoom', jsonParser, function (req,res){
  const {roomName} = req.body;
  // if this room doesn't exist, initialize it
  if (!rooms[roomName]) {
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
  socket.on("enter-room", (roomName, user) => {
    console.log("inside enter room ", roomName);
    console.log("in enter room", rooms[roomName]);
    // add random avatar to user before using
    const numAvailAvatars = rooms[roomName].availableAvatars.length;
    const avatarIndex = Math.floor(Math.random() * numAvailAvatars);
    const avatar = rooms[roomName].availableAvatars[avatarIndex];
    rooms[roomName].availableAvatars.splice(avatarIndex, 1);
    user.avatar = avatar;
    user.socketId = socket.id; // need this to know what socket disconnected on the backend

    rooms[roomName].users.push(user);

    socket.join(roomName);
    io.in(roomName).emit("user-connected", rooms[roomName]);
    console.log("user connected: ", rooms[roomName]);
  });

  socket.on("disconnect", () => {
    const roomName = socketToRoom[socket.socketId];
    if (!roomName) {
      // if user disconnected befor entering a room, don't do anything
      return;
    }

    // find the user we are disconnecting based on the socket's id
    var disconnectingUser = null;
    for (var i = 0; i < rooms[roomName].users.length; i++) {
      if (rooms[roomName].users[i].socketId === socket.socketId) {
        disconnectingUser = rooms[roomName].users[i];
      }
    }

    // remove user from the room users list
    rooms[roomName].users = rooms[roomName].users.filter(
      (obj) => obj.id !== disconnectingUser.id
    );

    // if there are no more users in the room, get rid of it 
    if (rooms[roomName].users.length === 0) {
      rooms[roomName] = null;
      return;
    }

    rooms[roomName].availableAvatars.push(disconnectingUser.avatar); // readd avatar to available list when user disconnects
    rooms[roomName].round.unusedSpeakers = rooms[roomName].round.unusedSpeakers.filter(
      (obj) => obj.id !== disconnectingUser.id
    ); // remove user from unusedSpeakers in case it is mid round and they haven't spoken yet and are leaving
    
     // if the user disconnecting was the currentUser/speaker, set this to be someone new
    if (rooms[roomName].round.currentUser.id === disconnectingUser.id) {
      rooms[romoId].round.currentUser.id = popSpeakerFor(roomName);
    } 

    // remove this socket from our socketToRoom map
    socketToRoom[socket.socketId] = null;
  
    io.in(roomName).emit("user-disconnected", {"roomData": rooms[roomName], "userid": disconnectingUser.id});
    console.log("user disconnected: ", {"roomData": rooms[roomName], "userid": disconnectingUser.id});
  });

  socket.on("update-user", (roomName, user) => {
    // go through each user in the given room
    for (let i = 0; i < rooms[roomName].users.length; i++) {
      // if this is the user we're looking for in the room (matched by ID)
      if (rooms[roomName].users[i].id === user.id) {
        // update this user in the room
        rooms[roomName].users[i] = user;
        break;
      }
    }

    io.in(roomName).emit("user-updated", rooms[roomName]);
    console.log("user updated: ", rooms[roomName]);
  });

  // start initializes a new round (called at the first start and every 'next question' after)
  socket.on("start", (roomName) => {
    // set prompt
    rooms[roomName].round.prompt = popPromptFor(roomName);

    // reset unusedSpeaker to hold all users
    rooms[roomName].round.unusedSpeakers = [...rooms[roomName].users]; 
    // set speaker
    rooms[roomName].round.currentUser = popSpeakerFor(roomName);

    // set round to started
    rooms[roomName].round.started = true;

    // reset all user positions to be undecided (position 2)
    resetUserPositionsFor(roomName);

    io.in(roomName).emit("round-updated", rooms[roomName]);
    console.log("round updated from start: ", rooms[roomName]);
  });

  socket.on("next-speaker", (roomName) => {
    // set speaker
    rooms[roomName].round.currentUser = popSpeakerFor(roomName);

    io.in(roomName).emit("round-updated", rooms[roomName]);
    console.log("round updated from next speaker: ", rooms[roomName]);
  });
});

function popPromptFor(roomName) {
  const numPossiblePrompts = rooms[roomName].unusedPrompts.length;
  if (numPossiblePrompts === 0) {
    rooms[roomName].finishedActivity = true;
    return "You've finished all prompts! Hope you enjoyed Spectrum :)"; // can update this message later
  }
  const promptIndex = Math.floor(Math.random() * numPossiblePrompts);
  const prompt = rooms[roomName].unusedPrompts[promptIndex];
  // remove the chosen prompt from the unused prompts
  rooms[roomName].unusedPrompts.splice(promptIndex, 1);
  return prompt;
}

// if next-speaker is accidentally called without an available next speaker, currently breaks
function popSpeakerFor(roomName) {
  const numPossibleSpeakers = rooms[roomName].round.unusedSpeakers.length;
  const speakerIndex = Math.floor(Math.random() * numPossibleSpeakers);
  const speaker = rooms[roomName].round.unusedSpeakers[speakerIndex];
  // remove the chosen speaker from the unused speakers
  rooms[roomName].round.unusedSpeakers.splice(speakerIndex, 1);
  return speaker; 
}

function resetUserPositionsFor(roomName) {
  // reset all user positions to be undecided (position 2)
  for (var i = 0; i < rooms[roomName].users.length; i++) {
    rooms[roomName].users[i].position = 2;
  }
}

server.listen(8000, () => {
  console.log("listening on 8000");
});
