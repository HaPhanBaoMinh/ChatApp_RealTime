import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { GoDotFill } from "react-icons/go";
import { AiOutlineSetting } from "react-icons/ai";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useNavigate } from "react-router-dom";

export default function Contacts({
  contacts,
  currentUser,
  handleChatChange,
  OnlineUser,
  socket,
}) {
  const [currentUserName, setcurrentUserName] = useState(undefined);
  const [currentUserImage, setcurrentUserImage] = useState(undefined);
  const [currentSelected, setcurrentSelected] = useState(undefined);

  const navigate = useNavigate();
  const handleClick = () => {
    if (currentUser) {
      localStorage.clear();
      socket.current.emit("logout", {
        _id: currentUser._id,
      });
      navigate("/login");
    }
  };

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
                {OnlineUser.includes(contact._id) ? (
                  <h3 className="online">
                    <GoDotFill /> <span>Online</span>
                  </h3>
                ) : (
                  <h3 className="offline">
                    <GoDotFill /> <span>Offline</span>
                  </h3>
                )}
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
          <Menu
            menuButton={
              <MenuButton>
                <AiOutlineSetting />
              </MenuButton>
            }
          >
            <MenuItem onClick={handleClick}>Logout</MenuItem>
            <MenuItem>Setting</MenuItem>
          </Menu>
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
    @media screen and (max-width: 720px) {
      height: 15%;
      h1 {
        font-size: 20px;
      }
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 1rem;
    &::-webkit-scrollbar {
      width: 0.1rem;
      background-color: #080420;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 10px;
      }
    }
    @media screen and (max-width: 720px) {
      height: 75%;
    }
    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      width: 90%;
      /* justify-content: space-around; */
      align-items: center;
      display: flex;
      gap: 1rem;
      padding-left: 15px;
      transition: 0.2s ease-in;
      border-radius: 0.2rem;
      cursor: pointer;

      @media screen and (max-width: 721px) {
        padding-left: 0;
        width: 100%;
        .username {
          display: none;
        }
        .online {
          display: none;
        }
        .offline {
          display: none;
        }
        .brand {
          height: 10%;
          h1 {
            font-size: 20px;
          }
        }
      }

      .avatar {
        img {
          border: 2px solid #080420;
          border-radius: 50px;
          padding: 3px;
          height: 4rem;
          background-color: #f3f3f35c;
        }
      }
      .username {
        min-width: 85px;
        h3 {
          color: white;
          margin-top: 7px;
        }
      }

      h3 {
        font-size: 1rem;
        margin-left: auto;
        margin-right: 10px;
        display: flex;
        margin-top: 7px;
        gap: 3px;
      }
      .online {
        svg {
          color: green;
        }
        color: #ffffff80;
      }
      .offline {
        svg {
          color: red;
        }
        color: #ffffff80;
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
          background-color: #f3f3f35c;
        }
      }
    }
  }
  .current-user {
    background-color: #080420;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
    border-top: 1px solid #ffffff39;
    @media screen and (max-width: 720px) {
      height: 10%;
      gap: 0;
      .avatar {
        display: none;
      }
      .username {
        text-align: center;
        h2 {
          font-size: 14px;
          overflow-wrap: break-word;
        }
      }
      .szh-menu-button {
        display: none;
      }
    }
    button {
      background-color: #3f3c5266;
      border: none;
      height: 2.5rem;
      width: 2.4rem;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20px;
      transition: 0.2s ease;

      svg {
        font-size: 21px;
        color: #909090;
      }
      cursor: pointer;
      &:hover {
        opacity: 0.8;
        transition: 0.2s ease;
      }
    }
    .avatar {
      img {
        border: 2px solid #4e0eff;
        border-radius: 50px;
        padding: 3px;
        height: 4rem;
        max-inline-size: 100%;
        background-color: #f3f3f35c;
      }
    }
    .username {
      min-width: 85px;
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
  @media screen and (min-width: 700px) and (max-width: 880px) {
    .online {
      svg {
        color: green;
      }
      color: #ffffff80;
      span {
        display: none;
      }
    }
    .offline {
      svg {
        color: red;
      }
      span {
        display: none;
      }
      color: #ffffff80;
    }
  }
  @media screen and (max-width: 721px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    justify-content: center;
  }
`;
