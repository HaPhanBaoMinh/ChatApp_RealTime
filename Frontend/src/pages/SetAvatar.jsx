import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loader from "../assets/Pulse-0.6s-173px.gif";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com/45678945";
  const negative = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar", toastOption);
    }
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
    try {
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.status) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        negative("/");
      } else {
        toast.error("Error setting avatar, Please try again", toastOption);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRandomAvatars = async () => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const image = `https://avatars.dicebear.com/api/micah/:${Math.round(
        Math.random() * 1000
      )}.svg`;
      data.push(image);
    }
    setAvatars(data);
    setIsloading(false);
  };

  useEffect(() => {
    getRandomAvatars();
    if (!localStorage.getItem("chat-app-user")) negative("/login");
  }, []);

  return (
    <>
      {isloading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avater as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={uuidv4()}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <span>Reload to get new avatar</span>
          <button className="submit-btn" onClick={() => setProfilePicture()}>
            Set as profile picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      img {
        height: 8rem;
        border: 2px solid #4e0eff;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.3s ease;
      }
    }
    .selected {
      border: 4px solid #4e0eff;
      border-radius: 50%;
      display: flex;
      transition: 0.3s ease;
      align-items: center;
      height: 9rem;
      justify-content: center;
    }
  }
  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    font-weight: bold;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    text-transform: uppercase;
    border-radius: 0.4rem;
    transition: 0.2s ease-in;
    &:hover {
      background-color: #4e0eff;
      transition: 0.2s ease-in;
    }
  }
  span {
    color: white;
  }
`;
