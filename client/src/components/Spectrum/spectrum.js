import React, { useState } from 'react';
import './spectrum.css';

function Spectrum() {
    const [position, setPosition] = useState(0);
    const [peers, setPeers] = useState([
            {color: "#4287f5", id:"dummyid1", name: "friend1", position: 0}, 
            {color:"#42f54e", id:"dummyid2", name: "friend2", position: -2},
            {color:"#fca103", id:"dummyid2", name: "friend3", position: 1}
        ]);

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
    const color = props.color ? props.color : '#000000';
    const name = props.name ? props.name : 'me';
    return (
        <div style={{color: color}}>{name}</div>
    )
  }

  function PeerPositionMarkers(props) {
      const position = props.position ? props.position : 0;
      const peers = props.peers ? props.peers : [];  
      return peers.map((peer, index) => {
        if (peer.position === position) {
            return <PositionMarker color={peer.color} name={peer.name}/>
        }
        return null;
      });
  }

  
  export default Spectrum;