
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
  
  useEffect(() => {
    const socket = io(config.serverUrl, { transports: ['websocket'] });

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

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <Home socket={socket} setUser={setUser} setRoomId={setRoomId} />} />
          <Route exact path="/room/:roomId" component={() => <Room startGame={startGame} user={user} setUser={setUser} roomId={roomId} roomData={roomData} updateUserPosition={updateUserPosition} />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
