import React, { useEffect, useState } from "react";
import Peer from 'peerjs';
import Spectrum from '../Spectrum/spectrum';
import Lobby from '../Lobby/lobby';
import VideoElement from '../Video/video';
import './room.css';



const CAPTURE_OPTIONS = {
  audio: false,
  video: true,
};

function Room(props) {
  const [videoStreams, setVideoStreams] = useState([]);
  const [peer, setPeer] = useState(null);
  const [newUser, setNewUser] = useState(true);

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

  // connect to peer
  useEffect(() => {
    console.log("MY UUID", props.user.id)
    const peer1 = new Peer('spectrum-' + props.user.id)
    setPeer(peer1);
  }, [])


  // Call the latest new user
  useEffect(() => {
    console.info(props.newestUser)
    if (props.newestUser && props.newestUser != props.user.id) {
      console.log("Call: ", props.newestUser)
      navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
        .then(stream => {
          console.log("Caller: stream found")
          var call = peer.call('spectrum-' + props.newestUser, stream);
          call.on('stream', function (remoteStream) {
            // Show stream in some video/canvas element.
            console.log("Caller: received response")
            setVideoStreams((prevVideoStreams) => [...prevVideoStreams, remoteStream])
          })
          call.on('close', () => {
            console.log("Caller: connection closed")
          })
        })
        .catch(err => {
          console.error("Caller: stream not found, could not find webcam. " + err)
        })
    }
  }, [props.newestUser])

  // Init listeners for incoming peer calls
  useEffect(() => {
    if (peer && newUser) {

      // Answer
      console.log("Answerer: Initialize")
      // console.log(peer)
      peer.on('call', function (call) {
        console.log("Answerer: Got a call")
        navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
          .then(stream => {
            console.log("Answerer: stream found")
            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function (remoteStream) {
              // Show stream in some video/canvas element.
              console.log("Answerer: received response")
              setVideoStreams((prevVideoStreams) => [...prevVideoStreams, remoteStream])
            });
            call.on('close', () => {
              console.log("Answerer: connection closed")
            })
          })
          .catch(err => {
            console.error("Answerer: stream not found, could not find webcam. " + err)
          });
      });

      setNewUser(false);
    }
  }, [peer])

  // Initialize own video stream
  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
      .then(stream => {
        if (mounted) {
          console.log("Self: stream found", stream)
          setVideoStreams((prevVideoStreams) => [...prevVideoStreams, stream])
        }
      })
      .catch(err => {
        console.error("Self: stream not found, could not find webcam. " + err)
      });

    return () => mounted = false;
  }, [])


  const spectrum = <Spectrum roomData={props.roomData} user={props.user} updateUserPosition={props.updateUserPosition} />;
  const lobby = <Lobby startGame={props.startGame} roomData={props.roomData} videoStreams={videoStreams} />;
  console.log("started: ", props.roomData.round.started);
  return (
    <>

      <div className="room-container">
        <div>
        {videoStreams.map(videoStream => (
          <VideoElement mediaStream={videoStream} />
        ))}
      </div>
        {props.roomData.round.started ? spectrum : lobby}
      </div>
    </>
  );
}

export default Room;
