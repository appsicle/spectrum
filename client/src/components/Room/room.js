import Spectrum from '../Spectrum/spectrum';
import { io } from 'socket.io-client';
import './room.css';

function Room(props) {

  props.socket.on('user-connected', (user) => {
    console.log(user)
  })

  return (
    <div className="room-container">
      <Spectrum/>
    </div>
  );
}

export default Room;
