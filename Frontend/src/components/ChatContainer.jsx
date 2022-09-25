import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Styled from "styled-components";
import loader from "../assets/Pulse-0.6s-173px.gif";
import { getAllMessageRouter, sendMeesageRouter } from "../utils/APIRoutes";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setmessages] = useState([]);
  const [arrivalMessage, setarrivalMessage] = useState(null);
  const scrollRef = useRef();

  const handleSendMsg = async (msg) => {
    axios.post(sendMeesageRouter, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setmessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setarrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setmessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const getMessage = async () => {
    if (currentChat) {
      const response = await axios.post(getAllMessageRouter, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setmessages(response.data);
    }
  };

  useEffect(() => {
    getMessage();
  }, [currentChat]);

  return (
    <>
      {currentChat ? (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currentChat.avatarImage} alt="avatar" />
              </div>
              <div className="username">
                <h3> {currentChat.username} </h3>
              </div>
            </div>
          </div>
          {/* <Message /> */}
          <div className="chat-message">
            {messages &&
              messages.map((msg, index) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message ${
                        msg.fromSelf ? "sended" : "recieved"
                      }`}
                    >
                      <p className="content"> {msg.message} </p>
                    </div>
                  </div>
                );
              })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      ) : (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      )}
    </>
  );
}

const Container = Styled.div`
    display: flex;
    overflow: auto;
    flex-direction: column;
    justify-content: center;
  .chat-header{
    border-bottom: 1px solid #ffffff39;
    padding: 2px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-details{
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar{
        img{
          border: 2px solid #4e0eff;
          border-radius: 50px;
          padding: 3px;
          height: 3rem;
          background-color: #f3f3f35c;

        }
      }
      .username{
        h3{
          color: white;
        }
      }
    }
  }
  .chat-message{
    height: 80%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;

    overflow: auto;
    .message{
        display: flex;
        align-items: center;
        .content{
          max-width: 40%;
          overflow-wrap: break-word;
          padding: 1rem;
          font-size: 1.1rem;
          border-radius: 1rem;
          color: #d1d1d1;
        }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }

  }
`;

export default ChatContainer;
