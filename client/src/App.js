
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
  const [socket, setSocket] = useState(null);
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

  useEffect(() => {
    console.log("ASDASDASDASDA")
  }, [])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Home socket={socket} setUser={setUser} setRoomId={setRoomId} />} />
          <Route exact path="/room/:roomId"
            render={() =>
              <Room startGame={startGame} user={user} roomId={roomId}
                roomData={roomData} updateUserPosition={updateUserPosition} setUser={setUser} userUuids={userUuids} />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
