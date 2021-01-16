import {
  Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';
import Home from './components/Home/home';
import Room from './components/Room/room';
import './App.css';

import PeerjsTest from './components/peerjsTest/PeerjsTest'

function App() {
  return (
    <div className="App">
      <PeerjsTest></PeerjsTest>
    </div>
  );
}

export default App;
