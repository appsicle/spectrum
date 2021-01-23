import React, { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  FormInput,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Fade
} from "shards-react";
import { v4 as uuid_v4 } from 'uuid';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './home.css';

function Home(props) {
  const [visible, setVisible] = useState(false);
  const [toCreate, setToCreate] = useState(false);
  const [nickname, setNickname] = useState("");
  const [roomName, setRoomName] = useState("");

  const history = useHistory();

  const submitForm = (e) => {
    e.preventDefault();
    const user = {
      id: uuid_v4(),
      name: nickname,
      position: 2,
      avatar: '',
      socketId: null,
    }
    if (toCreate) {
      // temp urls
      axios.post('http://localhost:8000/createRoom', {roomName: roomName, customPrompts: ['test prompt1', 'testprompt2']})
        .then( res => {
          console.log("createroom result", res);
          props.setUser(user);
          props.setRoomId(roomName);
          props.socket.emit('enter-room', roomName, user);
          history.push(`/room/${roomName}`);
        }).catch( error => {
          console.log(error);
        });
    } else {
      axios.post('http://localhost:8000/joinRoom', {roomName: roomName})
      .then( res => {
        console.log("joinroom result", res);
        props.setUser(user);
        props.setRoomId(roomName);
        props.socket.emit('enter-room', roomName, user);
        history.push(`/room/${roomName}`);
      }).catch( error => {
        console.log(error);
      });
    }
  };

  useEffect(() => {
    setVisible(!visible);
  },[]);

  return (
    <div className="home-container">
      <Fade in={visible}>
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
            onChange={(e) => setRoomName(e.target.value)}
          />
        </FormGroup>
        <Button
          disabled={!(nickname.length && roomName.length)}
          block
          outline
          onClick={(e) => { submitForm(e) }}
        >
          {toCreate ? 'Create New Room' : 'Join Room'}
        </Button>
      </Form>
        </Fade>
 
    </div>
  );
};

export default Home;
