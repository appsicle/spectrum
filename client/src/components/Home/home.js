import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormInput,
  Button,
  ButtonGroup,
  ButtonToolbar,
} from "shards-react";

import "./home.css";

function Home() {
  const [toCreate, setToCreate] = useState(false);
  const [nickname, setNickname] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  return (
    <div className="home-container">
      <h1 className="title">Spectrum</h1>
      <Form className="form-container">
      <ButtonToolbar className="toggle-button-container">
        <ButtonGroup className="toggle-button">
          <Button theme="light" onClick={(e) => {
            e.preventDefault();
            setToCreate(false);
          }} active={!toCreate} outline>Join Room</Button>
          <Button theme="light" onClick={(e) => {
            e.preventDefault();
            setToCreate(true);
          }} active={toCreate} outline>Create Room</Button>
        </ButtonGroup>
      </ButtonToolbar>
        <FormGroup>
          <label htmlFor=".username">Username</label>
          <FormInput
            className="username"
            placeholder="Username"
            onChange={(e) => setNickname(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor=".room">Room Name</label>
          <FormInput
            type="room"
            className="password"
            placeholder="Name of room"
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </FormGroup>
        <Button
          disabled={!(nickname.length && roomNumber.length)}
          block
          outline
        >
          {toCreate ? 'Create New Room' : 'Join Room'}
        </Button>
      </Form>
    </div>
  );
}

export default Home;
