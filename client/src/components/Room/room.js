import React, { useState, useEffect } from "react";
import Spectrum from "../Spectrum/spectrum";
import Lobby from "../Lobby/lobby";
import "./room.css";

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

  const spectrum = (
      <Spectrum
        socket={props.socket}
        roomId={props.roomId}
        roomData={props.roomData}
        user={props.user}
        updateUserPosition={props.updateUserPosition}
        videos={props.videos}
      />
  );
  const lobby = (
    <Lobby
      startGame={props.startGame}
      roomData={props.roomData}
      videos={props.videos}
    />
  );

  return (
    <div className="room-container">
      <div className="videos-container">test</div>
      {props.roomData.round.started ? spectrum : lobby}
    </div>
  );
}

export default Room;
