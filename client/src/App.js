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
  const socket = io(config.serverUrl);

  return (
    <div className="App">
     <Router>
        <Switch>
            <Route exact path="/" component={() => <Home socket={socket} />} />
            <Route exact path="/room/:roomId" component={() => <Room socket={socket} />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
