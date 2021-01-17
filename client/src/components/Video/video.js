import React, { useRef, useEffect } from "react";

function VideoElement({ mediaStream }) {
    const videoRef = useRef();

    useEffect(() => {
        if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
            videoRef.current.srcObject = mediaStream;
            console.log("Nice", mediaStream)
        } else {
            console.error("Not Nice", videoRef, mediaStream)
        }
    }, [])

    function handleCanPlay() {
        videoRef.current.play();
    }

    return (
        <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline />
    );
}

export default VideoElement;