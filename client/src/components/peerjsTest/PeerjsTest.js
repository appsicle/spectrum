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
        const conn = peer.connect('jojojojo' + id);

        // connect
        conn.on('open', () => {
            conn.send('hi!');
        });
        conn.on('data', (data) => {
            // Will print 'hello!'
            console.log(data);
        });
    }

    useEffect(() => {

        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                // Will print 'hi!'
                console.log(data);
            });
            conn.on('open', () => {
                conn.send('hello!');
            });
        });

    }, [])

    useEffect(() => {
        if (mediaStream && videoRefs.current[0] && !videoRefs.current[0].srcObject) {
            videoRefs.current[0].srcObject = mediaStream;
            videoRefs.current[0].play()
        }
        
    })


    return (
        <div>
            {uuid}
            <input value={id} onChange={(evt) => setId(evt.target.value)} />
            <button onClick={test}>click</button>
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
