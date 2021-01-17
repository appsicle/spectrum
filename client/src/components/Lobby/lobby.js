import React, { useState, useEffect } from "react";
import { Button, Fade } from "shards-react";
import Avatar from "../Avatar/avatar";
import "spinkit/spinkit.css";
import "./lobby.css";

function Lobby(props) {
  const [visible, setVisible] = useState(false);
  const users = props.roomData.users;

  useEffect(() => {
    setVisible(!visible);
  },[]);

  return (
    <div className="lobby-container">
      <div className="loader-container">
        <h2> Waiting for more players</h2>
        <div className="spinner sk-center sk-chase">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
        </div>
        <Button
          theme="primary"
          className="start-game-button"
          disabled={users.length < 2}
          onClick={props.startGame}
        >
          Start Game
        </Button>
      </div>
      <div className="avatar-container">
        {users.map((user, index) => (
          <Fade key={index} in={visible}>
            <Avatar key={index} user={user} />
          </Fade>
        ))}
      </div>
    </div>
  );
}

export default Lobby;
