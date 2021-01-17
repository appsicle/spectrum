import React, { useEffect } from "react";
import "./avatar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

function Avatar(props) {
  const setCrownOffset = () => {
    const element = document.querySelector(".avatar-icons-container");
    const width = element.offsetWidth;
    const crownOffset = Math.floor(width / 2);
    document.querySelector(".crown-icon").style.left = crownOffset + "px";
  };

  useEffect(() => {
    if (props.isSpeaker) {
      setCrownOffset();
    }
  }, [props]);

  return (
    <div
      className={
        "avatar-image-container" + (props.isSpeaker ? " is-speaker" : "")
      }
    >
      <div className="avatar-icons-container">
        {props.isSpeaker ? (
          <FontAwesomeIcon className="crown-icon" size="70px" icon={faCrown} />
        ) : null}
        <img className="avatar-image" src={props.user.avatar} alt="" />
      </div>

      <div className="user-name-container">
        <h4 style={{ color: props.isSpeaker ? "yellow" : "white" }}>
          {props.user.name}
        </h4>
      </div>
    </div>
  );
}

export default Avatar;
