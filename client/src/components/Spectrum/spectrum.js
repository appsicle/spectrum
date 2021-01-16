import React, { useState } from 'react';
import './spectrum.css';

function Spectrum(props) {
    const [position, setPosition] = useState(0);
    const [peers, setPeers] = useState(props.users);

    return (
    <div className="spectrum-container">
      <div className="strongly-disagree spectrum-item" onClick={() => {
          setPosition(-3);
      }}>
        <div className="spectrum-item-title">Strongly Disagree</div>
       {<PeerPositionMarkers peers={peers} position={-3}/>}
       {position === -3 ? <PositionMarker/> : null}
      </div>
      <div className="disagree spectrum-item" onClick={() => {
          setPosition(-2);
      }}>
       <div className="spectrum-item-title">Disagree</div>
       {<PeerPositionMarkers peers={peers} position={-2}/>}
       {position === -2 ? <PositionMarker/> : null}
      </div>
      <div className="somewhat-disagree spectrum-item" onClick={() => {
          setPosition(-1);
      }}>
       <div className="spectrum-item-title">Somewhat Disagree</div>
       {<PeerPositionMarkers peers={peers} position={-1}/>}
       {position === -1 ? <PositionMarker/> : null}
      </div>
      <div className="undecided spectrum-item" onClick={() => {
          setPosition(0);
      }}>
       <div className="spectrum-item-title">Undecided</div>
       {<PeerPositionMarkers peers={peers} position={0}/>}
       {position === 0 ? <PositionMarker/> : null}
      </div>
      <div className="somewhat-agree spectrum-item" onClick={() => {
          setPosition(1);
      }}>
       <div className="spectrum-item-title">Somewhat Agree</div>
       {<PeerPositionMarkers peers={peers} position={1}/>}
       {position === 1 ? <PositionMarker/> : null}
      </div>
      <div className="agree spectrum-item" onClick={() => {
          setPosition(2);
      }}>
       <div className="spectrum-item-title">Agree</div>
       {<PeerPositionMarkers peers={peers} position={2}/>}
       {position === 2 ? <PositionMarker/> : null}
      </div>
      <div className="strongly-agree spectrum-item" onClick={() => {
          setPosition(3);
      }}>
       <div className="spectrum-item-title">Strongly Agree</div>
       {<PeerPositionMarkers peers={peers} position={3}/>}
       {position === 3 ? <PositionMarker/> : null}
      </div>
    </div>
    );
  }

  function PositionMarker(props) {
    const name = props.name ? props.name : 'me';
    return (
        <span className="dot" > 
            <img src={props.avatar} alt=""/>
            {name}
        </span>
    );
  }

  function PeerPositionMarkers(props) {
      const position = props.position ? props.position : 0;
      const peers = props.peers.users ? props.peers.users : []; 
      // error below 
      return peers.map((peer, index) => {
        if (peer.position === position) {
            return <PositionMarker avatar={peer.avatar} name={peer.name}/>
        }
        return null;
      });
  }

  
  export default Spectrum;