import React from "react";
import './avatar.css'


function Avatar(props) {
  return (
    <div>
      <img className="avatar-image" src={props.user.avatar} alt="" />
      <div className="user-name-container">
        <p>{props.user.name}</p>
      </div>
    </div>
  );
}

export default Avatar;
