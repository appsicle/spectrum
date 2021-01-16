import React, { useState } from 'react';
import './spectrum.css';

function Spectrum() {
    const [position, setPosition] = useState(0);
    const [peers, setPeers] = useState([
            {color: "#4287f5", id:"dummyid1", name: "friend1", position: 0}, 
            {color:"#42f54e", id:"dummyid2", name: "friend2", position: -2}
        ]);

    return (
    <div className="spectrum-container">
      <div className="strongly-disagree spectrum-item" onClick={() => {
          setPosition(-3);
      }}>
       Strongly Disagree
       {<PeerPositionMarker peers={peers} position={-3}/>}
       {position === -3 ? <PositionMarker/> : null}
      </div>
      <div className="disagree spectrum-item" onClick={() => {
          setPosition(-2);
      }}>
       Disagree
       {<PeerPositionMarker peers={peers} position={-2}/>}
       {position === -2 ? <PositionMarker/> : null}
      </div>
      <div className="somewhat-disagree spectrum-item" onClick={() => {
          setPosition(-1);
      }}>
       Somewhat Disagree
       {<PeerPositionMarker peers={peers} position={-1}/>}
       {position === -1 ? <PositionMarker/> : null}
      </div>
      <div className="undecided spectrum-item" onClick={() => {
          setPosition(0);
      }}>
       Undecided
       {<PeerPositionMarker peers={peers} position={0}/>}
       {position === 0 ? <PositionMarker/> : null}
      </div>
      <div className="somewhat-agree spectrum-item" onClick={() => {
          setPosition(1);
      }}>
       Somewhat Agree
       {<PeerPositionMarker peers={peers} position={1}/>}
       {position === 1 ? <PositionMarker/> : null}
      </div>
      <div className="agree spectrum-item" onClick={() => {
          setPosition(2);
      }}>
       Agree
       {<PeerPositionMarker peers={peers} position={2}/>}
       {position === 2 ? <PositionMarker/> : null}
      </div>
      <div className="strongly-agree spectrum-item" onClick={() => {
          setPosition(3);
      }}>
       Strongly Agree
       {<PeerPositionMarker peers={peers} position={3}/>}
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

  function PeerPositionMarker(props) {
      const position = props.position ? props.position : 0;
      const peers = props.peers ? props.peers : [];  
      var filteredPeers = peers.map((peer, index) => {
        if (peer.position === position) {
            return <PositionMarker color={peer.color} name={peer.name}/>
        }
        return null;
      }).filter((el) => el != null);
      return filteredPeers;
  }

  
  export default Spectrum;