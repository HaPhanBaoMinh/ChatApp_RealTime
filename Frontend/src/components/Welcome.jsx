import React from "react";
import styled from "styled-components";
import robot from "../assets/robot.gif";
export default function Welcome({ currentName }) {
  return (
    <Container>
      <img src={robot} alt="welcome" />
      <h1>
        Welcome, <span>{currentName}</span>
      </h1>
      <h3>Please select a chat to start message</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0rem;
  img {
    height: 60%;
  }
  h1 {
    color: white;
    span {
      color: #4e0eff;
    }
  }
  h3 {
    padding-top: 10px;
    color: #ffffff39;
  }
`;
