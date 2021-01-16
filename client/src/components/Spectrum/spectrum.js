import React, { useEffect, useState } from "react";
import "./spectrum.css";

function Spectrum(props) {
  const [markerData, setMarkerData] = useState([]);
  const [roomData, setRoomData] = useState({
    users: [{}],
    unusedPrompts: [],
    round: {
      unusedSpeakers: [],
      prompt: "",
      currentUser: null,
    },
  });

  useEffect(() => {
    // whenever a new user connects, add it to state array
    console.log("mounted");
    props.socket.on("user-connected", (roomData) => {
      setRoomData(roomData);
      console.log(roomData);
    });

    props.socket.on("user-disconnected", (roomData) => {
      console.log("d");
      setRoomData(roomData);
      console.log(roomData);
    });

    return () => props.socket.disconnect();
  }, []);

  const updateUserPosition = () => {
    const user = props.user;
  };

  const bars = [
    {
      text: "Strongly Disagree",
      color: "red",
    },
    {
      text: "Disagree",
      color: "green",
    },
    {
      text: "Somewhat Disagree",
      color: "green",
    },
    {
      text: "Neutral",
      color: "blue",
    },
    {
      text: "Somewhat Agree",
      color: "green",
    },
    {
      text: "Agree",
      color: "green",
    },
    {
      text: "Strongly Agree",
      color: "green",
    },
  ];

  return (
    <div className="spectrum-container">
      {bars.map((bar, index) => (
        <div className="spectrum-item" style={{ backgroundColor: bar.color }}>
          <div className="spectrum-item-title">{bar.text}</div>
          <PositionMarkers markerData={roomData.users} position={index} />
        </div>
      ))}
    </div>
  );
}

function PositionMarkers(props) {
  const position = props.position ? props.position : 3;
  const markerData = props.markerData ? props.markerData : [];

  return markerData.map((user, index) => {
    const name = user.name ? user.name : "me";
    if (user.position === position) {
      return (
        <span className="dot">
          <img src={props.avatar} alt="" />
          {name}
        </span>
      );
    }
    return null;
  });
}

export default Spectrum;
