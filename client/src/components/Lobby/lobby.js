import React from "react";

function Lobby(props) {

  return (
    <div className="lobby-container">
      waiting for players...
      <button onClick={props.startGame}>start game</button>
    </div>
  );
}

export default Lobby;
