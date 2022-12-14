import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const negative = useNavigate();
  const [NewUserInfo, setNewUserInfo] = useState({
    username: "",
    password: "",
  });

  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    const { username, password } = NewUserInfo;
    event.preventDefault();
    if (handleValidation()) {
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOption);
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        negative("/");
      }
    }
  };

  const handleValidation = () => {
    const { username, password } = NewUserInfo;
    if (username.length < 3) {
      toast.error("Username should be greater than 3 character", toastOption);
      return false;
    }

    if (password.length < 3) {
      toast.error("Password should be greater than 3 character", toastOption);
      return false;
    }

    return true;
  };

  const handleOnChange = (event) => {
    setNewUserInfo({ ...NewUserInfo, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) negative("/");
  }, []);

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            {/* <img src={Logo} alt="Logo" /> */}
            <h1>MiHa</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(event) => handleOnChange(event)}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="on"
            onChange={(event) => handleOnChange(event)}
          />

          <button type="submit"> login</button>
          <span>
            Don't have an account ? <Link to="/register"> Register </Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 7rem;
    align-items: center;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 130%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
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
      a {
        color: #997af0;
      }
    }
  }
`;
