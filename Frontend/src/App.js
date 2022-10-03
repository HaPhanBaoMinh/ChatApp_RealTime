import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnswerCall from "./pages/AnswerCall";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetAvatar from "./pages/SetAvatar";
import VideoCall from "./pages/VideoCall";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setavatar" element={<SetAvatar />} />
        <Route path="/videocall/:userid" element={<VideoCall />} />
        <Route path="/answercall" element={<AnswerCall />} />
        <Route path="/" exact element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
