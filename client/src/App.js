
import React, { useEffect, useState, useRef } from "react";
import {
  Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';
import Peer from 'peerjs';
import { uuid as uuidv4 } from 'uuidv4';
import Home from './components/Home/home';
import Room from './components/Room/room';
import { io } from 'socket.io-client';
import config from './config';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import './App.css';

const uuid = uuidv4(); // remove this eventually because we're using the uuid generated in Home
const peer = new Peer('spectrum-' + uuid);  // using public peerjs server
// let userIndex = 0;

const CAPTURE_OPTIONS = {
  audio: false,
  video: true,
};

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [roomData, setRoomData] = useState({
    users: [],
    unusedPrompts: [],
    round: {
      unusedSpeakers: [],
      prompt: "",
      currentUser: null,
    },
  });
  const videoRefs = useRef([]);
  const [videos, setVideos] = useState([]);
  const [socket, setSocket] = useState(null);
  const [userIndex, setUserIndex] = useState(0);
  const [userUuids, setUserUuids] = useState([]);

  useEffect(() => {
    const socket = io(config.serverUrl, { transports: ['websocket'] });
    setSocket(socket);

    console.log('use effect ran');
    socket.on("user-connected", (roomData) => {
      setRoomData(roomData);
      // update user uuids 
      var uuids = [];
      for (let i = 0; i < roomData.users.length; i++) {
        uuids.push(roomData.users[i].id);
      }
      setUserUuids(uuids);
      // console.log("uuids on connect", uuids);
      // call uuid 
      console.log("user-connected: ", roomData);
    });

    socket.on("user-disconnected", (roomData) => {
      if (roomData.users.length === 0) {
        socket.disconnect();
        console.log('disconnected entire socket');
      }
      setRoomData(roomData);
      // update user uuids
      var uuids = [];
      for (let i = 0; i < roomData.users.length; i++) {
        uuids.push(roomData.users[i].id);
      }
      setUserUuids(uuids);
      // console.log("uuids on disconnect", uuids);
      console.log("user-disconnected: ", roomData);
    });

    socket.on("user-updated", (roomData) => {
      setRoomData(roomData);
      console.log("user-updated: ", roomData);
    });

    socket.on('round-updated', (roomData) => {
      setRoomData(roomData);
      console.log("round-updated: ", roomData);
    });
  }, []);

  const updateUserPosition = (position) => {
    var newUser = user;
    newUser.position = position;
    setUser(newUser); // update our personal record of our user
    socket.emit("update-user", roomId, user); // emit to everyone else that we updated
  };

  const startGame = () => {
    socket.emit('start', roomId);
  };



  // Helper to configure video objects
  const addVideo = (stream) => {
    console.info(stream)
    setVideos((prevVideos) => [...prevVideos, <video
      autoPlay
      playsInline
      ref={(el) => (videoRefs.current[userIndex] = el)}
    >{`video`}</video>])
    console.log(userIndex, videoRefs.current[userIndex])
    videoRefs.current[userIndex].srcObject = stream;
    videoRefs.current[userIndex].play();
    userIndex++;
  }

  // Send out calls to specified UUID
  const call = (id) => {
    navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
      .then(stream => {
        console.log("Caller: stream found")
        var call = peer.call('spectrum-' + id, stream);
        call.on('stream', function (remoteStream) {
          // Show stream in some video/canvas element.
          addVideo(remoteStream);
        })
      })
      .catch(err => {
        console.error("Caller: stream not found, could not find webcam. " + err)
      })
  }



  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <Home socket={socket} setUser={setUser} setRoomId={setRoomId} />} />
          <Route exact path="/room/:roomId" component={() => <Room startGame={startGame} user={user} roomId={roomId}
            roomData={roomData} updateUserPosition={updateUserPosition} setUser={setUser} videos={videos}
            setVideos={setVideos} peerjs={peer} peerjsUUID={uuid} videoRefs={videoRefs} userIndex={userIndex} setUserIndex={setUserIndex}/>} userUuids={userUuids} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
