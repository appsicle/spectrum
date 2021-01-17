// import React, { useState, useEffect, useRef } from 'react'
// import Peer from 'peerjs';
// import { v4 as uuidv4 } from 'uuid';

// const CAPTURE_OPTIONS = {
//     audio: false,
//     video: true,
// };

// const uuid = uuidv4()
// const peer = new Peer('jojojojo' + uuid);
// console.log(uuid)
// let userIndex = 1

// export default function PeerjsTest() {
//     const videoRefs = useRef([]);
//     const [videos, setVideos] = useState([]);

//     const [id, setId] = useState("");

//     const addVideo = (stream) => {
//         setVideos((prevVideos) => [...prevVideos, <video
//             autoPlay
//             playsInline
//             ref={(el) => (videoRefs.current[userIndex] = el)}
//         >{`video`}</video>])
//         // console.log(userIndex, videoRefs.current[userIndex])
//         videoRefs.current[userIndex].srcObject = stream;
//         videoRefs.current[userIndex].play();
//         userIndex++;
//     }

//     const test = () => {

//         navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
//             .then(stream => {
//                 console.log("yup1")
//                 var call = peer.call('jojojojo' + id, stream);
//                 call.on('stream', function (remoteStream) {
//                     // Show stream in some video/canvas element.
//                     addVideo(remoteStream);
//                 })
//             })
//             .catch(err => {
//                 console.log("nope1", err)
//             })
//     }

//     useEffect(() => {

//         peer.on('call', (call) => {
//             navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
//                 .then((stream) => {
//                     console.log("yup")
//                     call.answer(stream); // Answer the call with an A/V stream.
//                     call.on('stream', function (remoteStream) {
//                         // Show stream in some video/canvas element.
//                         console.log("Reciever")
//                         addVideo(remoteStream);
//                     });
//                 })
//                 .catch(err => {
//                     console.log("nope", err)
//                 });
//         });
//     }, []);

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
//             .then(stream => {
//                 addVideo(stream)
//             })
//             .catch(err => {
//                 console.log("nope", err)
//             });
//     }, [])

//     return (
//         <div>
//             {`my hash: ${uuid}`}
//             <input value={id} onChange={(evt) => setId(evt.target.value)} />
//             <button onClick={test}>connect to someone's hash</button>
//             {videos}
//         </div>
//     )
// }
