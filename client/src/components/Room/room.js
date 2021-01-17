import React, { useEffect } from "react";
import Spectrum from '../Spectrum/spectrum';
import Lobby from '../Lobby/lobby';
import './room.css';


const CAPTURE_OPTIONS = {
  audio: false,
  video: true,
};

function Room(props) {
  useEffect(() => {
    const users = props.roomData.users;
    for (let i = 0; i < users.length; ++i) {
      const user = users[i];
      if (user.id === props.user.id) {
        props.setUser(user);
        return;
      }
    }
  }, [props.roomData]);

  // Helper to configure video objects
  const addVideo = (stream) => {
    console.info(stream)
    setVideos((prevVideos) => [...prevVideos, <video
      autoPlay
      playsInline
      ref={(el) => (videoRefs.current[userIndex] = el)}
    >{`video`}</video>])
    console.log(userIndex, videoRefs.current[userIndex])
    videoRefs.current[userIndex].srcObject = stream;
    videoRefs.current[userIndex].play();
    // setUserIndex(userIndex+1);
  }

  // Listen for calls on my UUID
  //  useEffect(() => {
  //   peer.on('call', function (call) {
  //     navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
  //       .then(stream => {
  //         console.log("Answerer: stream found")
  //         call.answer(stream); // Answer the call with an A/V stream.
  //         call.on('stream', function (remoteStream) {
  //           // Show stream in some video/canvas element.
  //           addVideo(remoteStream);
  //         });
  //       })
  //       .catch(err => {
  //         console.error("Answerer: stream not found, could not find webcam. " + err)
  //       });
  //   });
  // }, [])

  // Initialize own video stream on video[0]
  useEffect(() => {
    if (videos.length == 0) {
      console.log("ASDALKSDJKL:ASJDLA:KLDJLA")
      navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
        .then(stream => {
          console.log("Self: stream found")
          addVideo(stream)
        })
        .catch(err => {
          console.error("Self: stream not found, could not find webcam. " + err)
        });
    }
  }, [])

  const peer = props.peerjs;
  // const uuid = props.peerjsUUID;
  const videoRefs = props.videoRefs;
  const setVideos = props.setVideos;
  const videos = props.videos;
  const userIndex = props.userIndex;
  const setUserIndex = props.setUserIndex;

  console.log("ROOMJS", videos)


  const spectrum = <Spectrum roomData={props.roomData} user={props.user} updateUserPosition={props.updateUserPosition} />;
  const lobby = <Lobby startGame={props.startGame} roomData={props.roomData} />;
  console.log("started: ", props.roomData.round.started);
  return (
    <>
      <div>
        {videos}
      </div>
      <div className="room-container">
        {props.roomData.round.started ? spectrum : lobby}
      </div>
    </>
  );
}

export default Room;
