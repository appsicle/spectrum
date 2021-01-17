import React from "react";
import { Button, Container } from "shards-react";
import Avatar from '../Avatar/avatar';
import "spinkit/spinkit.css";
import "./lobby.css";
import VideoElement from '../Video/video';

function Lobby(props) {
  const users = props.roomData.users;
  const videoStreams = props.videoStreams;

  // console.log("LOBBY", videoStreams)
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
          <Avatar key={index} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Lobby;
