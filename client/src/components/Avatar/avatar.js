import React from "react";

function Avatar(props) {

  return (
    <div>
      <img src={props.user.avatar} alt=""/>
      <p>{props.user.name}</p>
    </div>
  );
}

export default Avatar;
