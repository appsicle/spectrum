import React, { useEffect, useState } from "react";
import Spectrum from '../Spectrum/spectrum';
import { io } from 'socket.io-client';
import './room.css';

function Room(props) {
  return (
    <div className="room-container">
      <Spectrum socket={props.socket} user={props.user} />
    </div>
  );
}

export default Room;
