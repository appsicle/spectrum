import React, { useEffect, useState } from "react";
import Spectrum from '../Spectrum/spectrum';
import { io } from 'socket.io-client';
import './room.css';

function Room(props) {
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    let mounted = true;
      // whenever a new user connects, add it to state array
    if (mounted) {
      props.socket.on('user-connected', (roomData) => {
        console.log(roomData);
        setRoomData(roomData);
        console.log(roomData);
      })
    }

    return () => mounted = false;

  }, []);

  return (
    <div className="room-container">
      <Spectrum users={roomData} />
    </div>
  );
}

export default Room;
