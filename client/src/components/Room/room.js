import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import Spectrum from "../Spectrum/spectrum";
import Lobby from "../Lobby/lobby";
import VideoElement from "../Video/video";
import "./room.css";

const CAPTURE_OPTIONS = {
  audio: true,
  video: true,
};

const dup = []

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
    console.log("MY UUID", props.user.id);
    const peer1 = new Peer(
      "spectrum-" + props.user.id + "yert" + props.user.name
    );
    setPeer(peer1);
  }, []);

  // Call the latest new user
  useEffect(() => {
    console.info(props.newestUser);
    if (
      props.newestUser &&
      props.newestUser !== props.user.id + "yert" + props.user.name
    ) {
      console.log("Call: ", props.newestUser);
      navigator.mediaDevices
        .getUserMedia(CAPTURE_OPTIONS)
        .then((stream) => {
          console.log("Caller: stream found")
          var call = peer.call("spectrum-" + props.newestUser, stream);
          call.on("stream", function (remoteStream) {
            // Show stream in some video/canvas element.
            console.log("Caller: received response");
            let uuid, name;
            [uuid, name] = props.newestUser.split("yert");
            if (!dup.includes(uuid)) {
              dup.push(uuid)
              setVideoStreams((prevVideoStreams) => [
                ...prevVideoStreams,
                { stream: remoteStream, UUID: uuid, name: name, call: call },
              ]);
            } else {
              console.log("DUP");
            }
          });
          call.on("close", () => {
            console.log("Caller: connection closed");
          });
        })
        .catch((err) => {
          console.error(
            "Caller: stream not found, could not find webcam. " + err
          );
        });
    }
  }, [props.newestUser]);

  // Init listeners for incoming peer calls
  useEffect(() => {
    if (peer && newUser) {
      // Answer
      console.log("Answerer: Initialize");
      // console.log(peer)
      peer.on("call", function (call) {
        console.log("Answerer: Got a call");
        navigator.mediaDevices
          .getUserMedia(CAPTURE_OPTIONS)
          .then((stream) => {
            console.log("Answerer: stream found");
            call.answer(stream); // Answer the call with an A/V stream.
            call.on("stream", function (remoteStream) {
              // Show stream in some video/canvas element.
              console.log("Answerer: received response");
              let uuid, name;
              [uuid, name] = call.peer.slice(9).split("yert");
              if (!dup.includes(uuid)) {
                dup.push(uuid)
                setVideoStreams((prevVideoStreams) => [
                  ...prevVideoStreams,
                  { stream: remoteStream, UUID: uuid, name: name, call: call },
                ]);
              } else {
                console.log("DUP");
              }
            });
            call.on("close", () => {
              console.log("Answerer: connection closed");
            });
          })
          .catch((err) => {
            console.error(
              "Answerer: stream not found, could not find webcam. " + err
            );
          });
      });

      setNewUser(false);
    }
  }, [peer]);

  useEffect(() => {
    if (props.newestDisconnect) {
      console.log(
        videoStreams,
        props.newestDisconnect,
        videoStreams.filter((x) => x.UUID !== props.newestDisconnect)
      );
      const toBeDestroyed = videoStreams.filter(
        (x) => x.UUID === props.newestDisconnect
      )[0];
      if (toBeDestroyed && toBeDestroyed.call) {
        toBeDestroyed.call.close();
      }
      setVideoStreams((videoStreams) =>
        videoStreams.filter((x) => x.UUID !== props.newestDisconnect)
      );
    }
  }, [props.newestDisconnect]);

  // Initialize own video stream
  useEffect(() => {
    if (props.user) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          console.log("Self: stream found", stream);
          setVideoStreams((prevVideoStreams) => [
            ...prevVideoStreams,
            { stream: stream, UUID: props.user.id, name: props.user.name },
          ]);
        })
        .catch((err) => {
          console.error(
            "Self: stream not found, could not find webcam. " + err
          );
        });
    }
  }, []);

  const spectrum = (
    <Spectrum
      socket={props.socket}
      roomId={props.roomId}
      roomData={props.roomData}
      user={props.user}
      updateUserPosition={props.updateUserPosition}
      videos={props.videos}
    />
  );
  const lobby = (
    <Lobby
      startGame={props.startGame}
      roomData={props.roomData}
      videos={props.videos}
    />
  );
  console.log("started: ", props.roomData.round.started);

  console.log(props.roomData.users);
  return (
    <>
      <div className="room-container">
        <div className={'videos-container ' + (props.roomData.users.length >= 5 ? 'max-five' : 'auto-fit')}>
          {videoStreams.map((videoStream) => (
            <div className="video-container">
              <VideoElement mediaStream={videoStream.stream} />
              <div className="panel">
                <h3 className={"floating-text " + (props.roomData.round && props.roomData.round.currentUser && props.roomData.round.currentUser.id === videoStream.UUID ? "yellow" : "")} >{videoStream.name} </h3>
              </div>
            </div>
          ))}
        </div>
        {props.roomData.round.started ? spectrum : lobby}
      </div>
    </>
  );
}

export default Room;
