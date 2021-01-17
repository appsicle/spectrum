import React from "react";
import './avatar.css'


function Avatar(props) {
  return (
    <div className='avatar-image-container' >
      <img className="avatar-image" src={props.user.avatar} alt="" />
      <div className="user-name-container">
        <h4>{props.user.name}</h4>
      </div>
    </div>
  );
}

export default Avatar;
