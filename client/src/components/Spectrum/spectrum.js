import "./spectrum.css";

function Spectrum(props) {
  const roomData = props.roomData;
  // console.log("spectrum");
  // console.log(roomData);
  const updateUserPosition = props.updateUserPosition;

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
        <div className="spectrum-item" style={{ backgroundColor: bar.color }} onClick={() => {
          updateUserPosition(index);
        }}>
          <div className="spectrum-item-title">{bar.text}</div>
          <PositionMarkers markerData={roomData.users} position={index} />
        </div>
      ))}
    </div>
  );
};

function PositionMarkers(props) {
  const position = props.position;
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
};

export default Spectrum;
