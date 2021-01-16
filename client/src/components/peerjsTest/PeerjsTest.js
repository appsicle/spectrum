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

export default function PeerjsTest() {
    const videoRefs = useRef([]);
    const mediaStream = useUserMedia(CAPTURE_OPTIONS);

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
        if (mediaStream) {
            var call = peer.call('jojojojo' + id, mediaStream);
            call.on('stream', function (remoteStream) {
                // Show stream in some video/canvas element.
                videoRefs.current[1].srcObject = remoteStream
                videoRefs.current[1].play()
                console.log("Caller: should be playing")
            });
        }else{
            console.log("nope")
        }


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
            if (mediaStream) {
                call.answer(mediaStream); // Answer the call with an A/V stream.
                call.on('stream', function (remoteStream) {
                    // Show stream in some video/canvas element.
                    videoRefs.current[1].srcObject = remoteStream
                    videoRefs.current[1].play()
                    console.log("Reciever: should be playing")

                });
            }
        });

    }, [])

    useEffect(() => {
        if (mediaStream && videoRefs.current[0] && !videoRefs.current[0].srcObject) {
            videoRefs.current[0].srcObject = mediaStream;
            videoRefs.current[0].play()
            console.log("ASD")
        }
    }, [])


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
