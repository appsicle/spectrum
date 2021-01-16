
import React, { useState } from "react";
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
  const socket = io(config.serverUrl);

  const handleUser = (user) => {
    setUser(user);
  }

  return (
    <div className="App">
     <Router>
        <Switch>
            <Route exact path="/" component={() => <Home socket={socket} handleUser={handleUser} />} />
            <Route exact path="/room/:roomId" component={() => <Room socket={socket} user={user} />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
