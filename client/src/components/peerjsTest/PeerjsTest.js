import React, { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { useUserMedia } from './useUserMedia';

const CAPTURE_OPTIONS = {
    audio: false,
    video: true,
};



const uuid = uuidv4()
const peer = new Peer('jojojojo' + uuid);
console.log(uuid)
let userIndex = 1

export default function PeerjsTest() {
    const videoRefs = useRef([]);

    const [id, setId] = useState("");


    const test = () => {
        // const conn = peer.connect('jojojojo' + id);

        // // connect
        // conn.on('open', () => {
        //     conn.send('hi!');
        // });
        // conn.on('data', (data) => {
        //     // Will print 'hello!'
        //     console.log(data);
        // });

        navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
            .then(stream => {
                console.log("yup1")
                var call = peer.call('jojojojo' + id, stream);
                call.on('stream', function (remoteStream) {
                    // Show stream in some video/canvas element.
                    videoRefs.current[userIndex].srcObject = remoteStream
                    videoRefs.current[userIndex].play()
                    userIndex++;
                })
            })
            .catch(err => {
                console.log("nope1", err)
            })


    }

    useEffect(() => {

        // peer.on('connection', (conn) => {
        //     conn.on('data', (data) => {
        //         // Will print 'hi!'
        //         console.log(data);
        //     });
        //     conn.on('open', () => {
        //         conn.send('hello!');
        //     });
        // });

        peer.on('call', function (call) {
            navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
                .then(stream => {
                    console.log("yup")
                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on('stream', function (remoteStream) {
                        // Show stream in some video/canvas element.
                        videoRefs.current[userIndex].srcObject = remoteStream
                        videoRefs.current[userIndex].play()
                        userIndex++;
                    });
                })
                .catch(err => {
                    console.log("nope", err)

                });
        });

    }, [])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS)
            .then(stream => {
                videoRefs.current[0].srcObject = stream;
                videoRefs.current[0].play()
            })
            .catch(err => {
                console.log("nope", err)
            });
    })


    return (
        <div>
            {`my hash: ${uuid}`}
            <input value={id} onChange={(evt) => setId(evt.target.value)} />
            <button onClick={test}>connect to someone's hash</button>
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
