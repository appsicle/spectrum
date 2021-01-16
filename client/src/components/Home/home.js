import React, { useState } from 'react';
import './home.css';

function Home() {
  const [toCreate, setToCreate] = useState(false);

  return (
    <div className="home-container">
     <div className="form-container">
       <div className="room-action-button-container">
         <button className="join-game-button" onClick={() => {
           setToCreate(false);
         }}>
           Join Game
         </button>
         <button className="create-game-button" onClick={() => {
           setToCreate(true);
         }}>
           Create Game
         </button>
       </div>
       <div className="input-container">
         <input type="text" className="name-input" placeholder="Nickname" />
         <input type="text" className="room-input" placeholder="Room Name" />
         <button className="submit-button">
           {toCreate ? 'Create room' : 'Join room'}
         </button>
       </div>
     </div>
    </div>
  );
}

export default Home;
