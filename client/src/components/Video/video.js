import React, { useRef } from "react";

function Video({mediaStream}) {
    const videoRef = useRef();

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function handleCanPlay() {
        videoRef.current.play();
    }

    return (
        <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
    );
}

export default Video;