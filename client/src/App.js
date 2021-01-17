
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
  const [newestUser, setNewestUser] = useState(null);
  const [newestDisconnect, setNewestDisconnect] = useState(null);

  useEffect(() => {
    const socket = io(config.serverUrl, { transports: ['websocket'] });
    setSocket(socket);

    socket.on("user-connected", (roomData) => {
      setRoomData(roomData);
      setNewestUser(roomData.users[roomData.users.length - 1].id + "yert" + roomData.users[roomData.users.length - 1].name);
      console.log("user-connected: ", roomData);
    });

    socket.on("user-disconnected", (roomData) => {
      console.log("user-disconnected: ", roomData);

      if (roomData.roomData.users.length === 0) {
        socket.disconnect();
      }

      setNewestDisconnect(roomData.userid);

      setRoomData(roomData.roomData);
      
      console.log("user-disconnected: ", roomData);
    });

    socket.on("user-updated", (roomData) => {
      setRoomData(roomData);
    });

    socket.on('round-updated', (roomData) => {
      setRoomData(roomData);
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
          <Route exact path="/" render={() => <Home socket={socket} setUser={setUser} setRoomId={setRoomId} />} />
          <Route exact path="/room/:roomId"
            render={() =>
              <Room startGame={startGame} user={user} roomId={roomId} newestDisconnect={newestDisconnect}
                roomData={roomData} updateUserPosition={updateUserPosition} setUser={setUser} newestUser={newestUser} socket={socket} />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
