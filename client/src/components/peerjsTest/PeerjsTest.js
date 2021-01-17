import React, { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs';
import uuidv4 from 'uuidv4';

const CAPTURE_OPTIONS = {
    audio: false,
    video: true,
};



const uuid = uuidv4()
const peer = new Peer('jojojojo' + uuid);
let userIndex = 1

export default function GetUUID() {
    return uuid;
};

export default function PeerjsTest() {
    const videoRefs = useRef([]);

    // Send out calls to 
    const call = (id) => {
        navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
            .then(stream => {
                console.log("Caller: stream found")
                var call = peer.call('jojojojo' + id, stream);
                call.on('stream', function (remoteStream) {
                    // Show stream in some video/canvas element.
                    videoRefs.current[userIndex].srcObject = remoteStream
                    videoRefs.current[userIndex].play()
                    userIndex++;
                })
            })
            .catch(err => {
                console.error("Caller: stream not found, could not find webcam. " + err)
            })
    }


    // Listen for calls to this UUID
    useEffect(() => {
        peer.on('call', function (call) {
            navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
                .then(stream => {
                    console.log("Answerer: stream found")
                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on('stream', function (remoteStream) {
                        // Show stream in some video/canvas element.
                        videoRefs.current[userIndex].srcObject = remoteStream
                        videoRefs.current[userIndex].play()
                        userIndex++;
                    });
                })
                .catch(err => {
                    console.error("Answerer: stream not found, could not find webcam. " + err)
                });
        });
    }, [])

    // Initialize own video stream
    useEffect(() => {
        navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
            .then(stream => {
                console.log("Self: stream found")
                videoRefs.current[0].srcObject = stream;
                videoRefs.current[0].play()
            })
            .catch(err => {
                console.error("Self: stream not found, could not find webcam. " + err)
            });
    })


    return (
        <div>
            {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => {
                return <video
                    autoPlay
                    playsInline
                    ref={(el) => (videoRefs.current[i] = el)}
                >{`video${i}`}</video>
            })}
        </div>
    )
}
