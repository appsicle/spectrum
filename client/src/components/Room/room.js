import React, { useEffect } from "react";
import Spectrum from '../Spectrum/spectrum';
import Lobby from '../Lobby/lobby';
import './room.css';

function Room(props) {
  useEffect(() => {
    const users = props.roomData.users;
    for (let i = 0; i < users.length; ++i) {
      const user = users[i];
      if (user.id === props.user.id) {
        props.setUser(user);
        return;
      }
    }
  }, [props.roomData]);

  const spectrum = <Spectrum roomData={props.roomData} user={props.user} updateUserPosition={props.updateUserPosition}/>;
  const lobby = <Lobby startGame={props.startGame} roomData={props.roomData}/>;
  console.log("started: ", props.roomData.round.started);
  return (
    <div className="room-container">
      {props.roomData.round.started ? spectrum : lobby}
    </div>
  );
}

export default Room;
