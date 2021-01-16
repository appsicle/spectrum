import Spectrum from '../Spectrum/spectrum';
import './room.css';

function Room(props) {
  return (
    <div className="room-container">
      <Spectrum roomData={props.roomData} user={props.user} updateUserPosition={props.updateUserPosition}/>
    </div>
  );
}

export default Room;
