import "./spectrum.css";
import Avatar from "../Avatar/avatar";
import useSound from 'use-sound';
import sound from '../../sounds/new_speaker.mp3';

import {
  Button,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Fade,
} from "shards-react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faFastForward } from "@fortawesome/free-solid-svg-icons";

function Spectrum(props) {
  const roomData = props.roomData;
  const updateUserPosition = props.updateUserPosition;
  const currentUser = roomData.round.currentUser;
  const myUser = props.user;

  const [playSound] = useSound(sound);
  const [openModal, setOpenModal] = useState(false);

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

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (currentUser.id === myUser.id) {
      playSound();
      toggleModal();
    } else {
      setOpenModal(false);
    }
  }, [currentUser.id]);

  // important note: ability to change to next speaker must be disabled when roomData.round.unusedSpeakers is empty
  // otherwise, the whole application will crash if you select that lmao
  // next prompt button is going only be shown to the current speaker just for organized control over the room
  return (
    <div className="bottom-container">
      <Modal animation open={openModal} toggle={toggleModal}>
        <ModalHeader className="modal-header">
          🚨 YOU ARE THE SPEAKER 🚨
        </ModalHeader>
        <ModalBody>
          <h8 className="modal-body-text">
            It's your time to shine! Lead the discussion and answer the prompt!
          </h8>
        </ModalBody>
      </Modal>

      <div className="prompt-container">
        <h1>
          {roomData.round.prompt}
        </h1>
      </div>
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
            <div className="avatars-container">
              <PositionMarkers
                speakerId={currentUser.id}
                markerData={roomData.users}
                position={index}
              />
            </div>
          </div>
        ))}
        {roomData.finishedActivity ? null :
          <ButtonGroup vertical className="skip-buttons">
            <Button
              theme="primary"
              id="skip-prompt"
              onClick={() => {
                props.socket.emit("start", props.roomId);
              }}
              disabled={roomData.round.currentUser.id !== props.user.id}
            >
              <FontAwesomeIcon icon={faFastForward} />
              <span className="skip-button-text">Next prompt</span>
            </Button>
            {!roomData.round.unusedSpeakers.length ? null :
              <Button
                theme="secondary"
                id="skip-speaker"
                onClick={() => {
                  props.socket.emit("next-speaker", props.roomId);
                }}
                disabled={roomData.round.currentUser.id !== props.user.id}
              >
                <FontAwesomeIcon icon={faComments} />
                <span className="skip-button-text"> Next speaker</span>
              </Button>}
          </ButtonGroup>}
      </div>
    </div>
  );
}

function PositionMarkers(props) {
  const [visible, setVisible] = useState(false);
  const position = props.position;
  const markerData = props.markerData ? props.markerData : [];

  useEffect(() => {
    setVisible(!visible);
  }, []);


  return markerData.map((user, index) => {
    if (user.position === position) {
      return (
        <Fade in={visible}>
          <Avatar
            user={user}
            isSpeaker={user.id === props.speakerId ? true : false}
          />
        </Fade>
      );
    }
    return null;
  });
}

export default Spectrum;
