import React, { useState } from "react";
import { Form, FormGroup, FormInput, Button } from "shards-react";

import "./home.css";

function Home() {
  const [nickname, setNickname] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  return (
    <div className="home-container">
      <h1 className="title">Spectrum</h1>
      <Form className="form-container">
      <FormGroup>
        <label htmlFor=".username">Username</label>
        <FormInput className="username" placeholder="Username" onChange={(e) => setNickname(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <label htmlFor=".room">Room</label>
        <FormInput type="room" className="password" placeholder="Name of room" onChange={(e) => setRoomNumber(e.target.value)} />
      </FormGroup>
      <Button disabled={!(nickname.length && roomNumber.length)} block outline>Enter Room</Button>
    </Form>
    </div>
  );
}

export default Home;
