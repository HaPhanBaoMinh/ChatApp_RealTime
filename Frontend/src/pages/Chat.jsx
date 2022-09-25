import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { allUserRouter, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

export default function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setcurrentUser] = useState(undefined);
  const [currentChat, setcurrentChat] = useState(undefined);
  const [isLoaded, setIsloaded] = useState(false);
  const [OnlineUser, setOnlineUser] = useState([]);

  const negative = useNavigate();

  const getContact = async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const { data } = await axios.get(`${allUserRouter}/${currentUser._id}`);
        setContacts(data);
      } else {
        negative("/setavatar");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host, {
        query: {
          userId: currentUser._id,
        },
      });
      socket.current.emit("add-user", currentUser._id);
      socket.current.on("online-user", (onlineList) => {
        setOnlineUser(onlineList);
      });
    }
    getContact();
  }, [currentUser]);

  // console.log(OnlineUser);

  const handleChatChange = (chat) => {
    setcurrentChat(chat);
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      negative("/login");
    } else {
      setcurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
      setIsloaded(true);
    }
  }, []);
  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          handleChatChange={handleChatChange}
          OnlineUser={OnlineUser}
          socket={socket}
        />
        {isLoaded && !currentChat ? (
          <Welcome currentName={currentUser.username} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #131313;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
