import "./spectrum.css";
import Avatar from '../Avatar/avatar'

function Spectrum(props) {
  const roomData = props.roomData;
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
    if (user.position === position) {
      return (
        <Avatar user={user} />
      );
    }
    return null;
  });
};

export default Spectrum;
