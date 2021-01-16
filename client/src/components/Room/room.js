import React, { useState } from "react";
import Spectrum from '../Spectrum/spectrum';
import Lobby from '../Lobby/lobby';
import './room.css';

function Room(props) {
  const spectrum = <Spectrum roomData={props.roomData} user={props.user} updateUserPosition={props.updateUserPosition}/>;
  const lobby = <Lobby startGame={props.startGame} />;
  console.log("started: ", props.roomData.round.started);
  return (
    <div className="room-container">
      {props.roomData.round.started ? spectrum : lobby}
    </div>
  );
}

export default Room;
