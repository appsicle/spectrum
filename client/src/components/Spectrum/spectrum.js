import "./spectrum.css";
import Avatar from '../Avatar/avatar'

function Spectrum(props) {
  const roomData = props.roomData;
  const updateUserPosition = props.updateUserPosition;

  const bars = [
    {
      text: "Strongly Agree",
      color: "rgba(30, 148, 62, 0.6)",
    },
    {
      text: "Agree",
      color: "rgba(200, 220, 0, 0.6)",
    },
    {
      text: "Neutral",
      color: "rgba(254, 191, 0, 0.6)",
    },
    {
      text: "Disagree",
      color: "rgba(255, 115, 1, 0.6)",
    },
    {
      text: "Strongly Disagree",
      color: "rgba(230, 34, 30, 0.6)",
    },
  ];

  return (
    <div>
      
      {roomData.round.prompt}
      {roomData.round.currentUser.name}
      <div onClick={()=> {
        console.log(props.roomId);
        props.socket.emit("start", props.roomId);
        console.log('next prompt boii');
      }}>CLICK ME</div>
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
