import "./spectrum.css";
import Avatar from "../Avatar/avatar";
import { Button, ButtonGroup, Container, Tooltip } from "shards-react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faFastForward } from "@fortawesome/free-solid-svg-icons";

function Spectrum(props) {
  const roomData = props.roomData;
  const updateUserPosition = props.updateUserPosition;
  const [openSkipPromptTip, setOpenSkipPromptTip] = useState(false);
  const [openSkipSpeakerTip, setOpenSkipSpeakerTip] = useState(false);

  const toggleSkipSpeakerTip = () => {
    setOpenSkipSpeakerTip(!openSkipSpeakerTip);
  };

  const toggleSkipPromptTip = () => {
    setOpenSkipPromptTip(!openSkipPromptTip);
  };

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

  // important note: ability to change to next speaker must be disabled when roomData.round.unusedSpeakers is empty
  // otherwise, the whole application will crash if you select that lmao
  // next prompt button is going only be shown to the current speaker just for organized control over the room
  return (
    <div className="bottom-container">
      <div className="prompt-container">
        <h1>{roomData.round.prompt}</h1>
      </div>
      {/* {roomData.round.currentUser.name} */}
      <div className="spectrum-container">
      {bars.map((bar, index) => (
        <div
          className="spectrum-item"
          style={{ backgroundColor: bar.color }}
          onClick={() => {
            updateUserPosition(index);
          }}
        >
          <div className="spectrum-item-title">{bar.text}</div>
          <PositionMarkers markerData={roomData.users} position={index} />
        </div>
      ))}


      <ButtonGroup vertical className="skip-buttons">
        <Button
          theme="primary"
          id="skip-prompt"
          onClick={() => {
            props.socket.emit("start", props.roomId);
            console.log("next prompt boii");
          }}
        >
          <FontAwesomeIcon icon={faFastForward} />
          <span className="skip-button-text">Skip prompt</span>
        </Button>
        <Tooltip
          noArrow
          delay="400"
          placement="right"
          open={openSkipPromptTip}
          target="#skip-prompt"
          toggle={toggleSkipPromptTip}
        >
          Tired of this prompt? Skip it!
        </Tooltip>
        <Button
          theme="secondary"
          id="skip-speaker"
          onClick={() => {
            props.socket.emit("next-speaker", props.roomId);
          }}
        >
          <FontAwesomeIcon icon={faComments} />
          <span className="skip-button-text"> Next speaker</span>
        </Button>
        <Tooltip
          noArrow
          delay="400"
          placement="right"
          open={openSkipSpeakerTip}
          target="#skip-speaker"
          toggle={toggleSkipSpeakerTip}
        >
          Done speaking? Who's next!
        </Tooltip>
      </ButtonGroup>
    </div>
    </div>
    
  );
}

function PositionMarkers(props) {
  const position = props.position;
  const markerData = props.markerData ? props.markerData : [];

  return markerData.map((user, index) => {
    if (user.position === position) {
      return <Avatar user={user} />;
    }
    return null;
  });
}

export default Spectrum;
