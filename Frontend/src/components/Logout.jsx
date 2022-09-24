import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiPowerOff } from "react-icons/bi";

function Logout() {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Button onClick={() => handleClick()}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7rem;
  border-radius: 10px;
  background-color: red;
  cursor: pointer;
  background-color: #9186f3;
  svg {
    color: white;
    font-size: 17px;
  }
`;

export default Logout;
