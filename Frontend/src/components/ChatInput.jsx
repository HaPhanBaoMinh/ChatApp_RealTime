import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handEmojiClick = (event, emoji) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
    setShowEmojiPicker(false);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendMessage(e)}>
        <input
          type="test"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit">
          <IoSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  /* background-color: #080420; */
  padding: 0 2rem;
  padding-bottom: 0.9rem;
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
      }
    }
  }
  .input-container {
    width: 100%;
    height: 130%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      outline: none;
      &::selection {
        background-color: #9186f3;
      }
      &::focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      background-color: #9186f3;
      cursor: pointer;
      transition: 0.1s ease;
      border: none;
      border: nonesvg {
        font-size: 2rem;
        color: white;
      }
      svg {
        color: white;
      }
      &:hover {
        opacity: 0.9;
        transition: 0.1s ease;
      }
    }
  }
`;
