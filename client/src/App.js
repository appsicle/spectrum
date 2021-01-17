
import React, { useEffect, useState } from "react";
import {
  Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';
import Home from './components/Home/home';
import Room from './components/Room/room';
import { io } from 'socket.io-client';
import config from './config';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import './App.css';

const uuid = uuidv4();
const peer = new Peer('spectrum-' + uuid);  // using public peerjs server
let userIndex = 1;

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
  
  useEffect(() => {
    const socket = io(config.serverUrl, { transports: ['websocket'] });
    setSocket(socket);

    console.log('use effect ran');
    socket.on("user-connected", (roomData) => {
      setRoomData(roomData);
      console.log("user-connected: ", roomData);
    });

    socket.on("user-disconnected", (roomData) => {
      if (roomData.users.length === 0) {
        socket.disconnect();
        console.log('disconnected entire socket');
      }
      setRoomData(roomData);
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
    setVideos((prevVideos) => [...prevVideos, <video
      autoPlay
      playsInline
      ref={(el) => (videoRefs.current[userIndex] = el)}
    >{`video`}</video>])
    // console.log(userIndex, videoRefs.current[userIndex])
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

  // Listen for calls on my UUID
  useEffect(() => {
    peer.on('call', function (call) {
      navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
        .then(stream => {
          console.log("Answerer: stream found")
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', function (remoteStream) {
            // Show stream in some video/canvas element.
            addVideo(remoteStream);
          });
        })
        .catch(err => {
          console.error("Answerer: stream not found, could not find webcam. " + err)
        });
    });
  }, [])

  // Initialize own video stream on video[0]
  useEffect(() => {
    navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
      .then(stream => {
        console.log("Self: stream found")
        addVideo(stream)
      })
      .catch(err => {
        console.error("Self: stream not found, could not find webcam. " + err)
      });
  })

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <Home socket={socket} setUser={setUser} setRoomId={setRoomId} />} />
          <Route exact path="/room/:roomId" component={() => <Room startGame={startGame} user={user} roomId={roomId} roomData={roomData} updateUserPosition={updateUserPosition} setUser={setUser} videos={videos}/>} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
