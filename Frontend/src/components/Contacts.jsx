import React, { useEffect, useState } from "react";
import Logo from "../assets/daadc760db9a01647758d2728f3a228d.png";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

export default function Contacts({ contacts, currentUser, handleChatChange }) {
  const [currentUserName, setcurrentUserName] = useState(undefined);
  const [currentUserImage, setcurrentUserImage] = useState(undefined);
  const [currentSelected, setcurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contact) => {
    setcurrentSelected(index);
    handleChatChange(contact);
  };

  useEffect(() => {
    if (currentUser) {
      setcurrentUserName(currentUser.username);
      setcurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);

  return (
    currentUserName &&
    currentUserImage && (
      <Container>
        <div className="brand">
          <h1>MIHA</h1>
        </div>
        <div className="contacts">
          {contacts.map((contact, index) => {
            return (
              <div
                className={`contact ${
                  currentSelected === index ? "selected" : ""
                }`}
                key={uuidv4()}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img src={contact.avatarImage} alt="avatar" />
                </div>

                <div className="username">
                  <h3> {contact.username} </h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img src={currentUserImage} alt="avatar" />
          </div>

          <div className="username">
            <h2> {currentUserName} </h2>
          </div>
        </div>
      </Container>
    )
  );
}

const Container = styled.div`
  display: grid;
  overflow: hidden;
  background-color: #080420;
  grid-template-rows: 10% 75% 15%;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      border: 2px solid #4e0eff;
      border-radius: 50px;
      padding: 3px;
      height: 4rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.1rem;
      background-color: #080420;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 10px;
      }
    }
    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      width: 90%;
      align-items: center;
      display: flex;
      gap: 1rem;
      padding-left: 15px;
      transition: 0.2s ease-in;
      border-radius: 0.2rem;
      cursor: pointer;
      .avatar {
        img {
          border: 2px solid #080420;
          border-radius: 50px;
          padding: 3px;
          height: 4rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9186f3;
      transition: 0.2s ease-in;
      .avatar {
        img {
          border: 2px solid #4e0eff;
          border-radius: 50px;
          padding: 3px;
          height: 4rem;
        }
      }
    }
  }
  .current-user {
    background-color: #080420;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    border-top: 1px solid #ffffff39;
    .avatar {
      img {
        border: 2px solid #4e0eff;
        border-radius: 50px;
        padding: 3px;
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
