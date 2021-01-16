import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormInput,
  Button,
  ButtonGroup,
  ButtonToolbar,
} from "shards-react";
import { uuid } from 'uuidv4';
import { useHistory } from "react-router-dom";
import './home.css';

function Home(props) {
  const [toCreate, setToCreate] = useState(false);
  const [nickname, setNickname] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const history = useHistory();

  const submitForm = (e) => {
    e.preventDefault();
    const user = {
      id: uuid(),
      name: nickname,
      position: 0,
      avatar: 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg'
    }
    props.socket.emit('enter-room', roomNumber, user);
    props.handleUser(user);
    history.push(`/room/${roomNumber}`);

    // redirect to url/roomNumber

  };

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
            className="password"
            placeholder="Name of room"
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </FormGroup>
        <Button
          disabled={!(nickname.length && roomNumber.length)}
          block
          outline
          onClick={(e) => {submitForm(e)}}
        >
          {toCreate ? 'Create New Room' : 'Join Room'}
        </Button>
      </Form>
    </div>
  );
}

export default Home;
