import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MdCallEnd } from "react-icons/md";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import { IoMdMicOff } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Peer } from "peerjs";
import { host } from "../utils/APIRoutes";
import { io } from "socket.io-client";

function VideoCall() {
  const [currentUser, setcurrentUser] = useState(undefined);
  const [isEndCall, setisEndCall] = useState(false);
  const [MyPeer, setMyPeer] = useState(undefined);
  const negative = useNavigate();
  let { calluserid } = useParams();
  const myVideo = document.getElementsByClassName("myVideo")[0];
  const currentVideoCall =
    document.getElementsByClassName("currentVideoCall")[0];
  const socket = useRef();

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  }

  const handleEndCall = (MyPeer) => {
    setisEndCall(true);
    MyPeer.close();
    // console.log(MyPeer);
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      negative("/login");
    } else {
      setcurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      setMyPeer(
        new Peer(currentUser._id, {
          host: "my-chat-app-incv.herokuapp.com",
          port: 443,
          secure: true,
        })
      );

      socket.current = io(host, {
        query: {
          userId: currentUser._id,
        },
      });

      socket.current.emit("make-call", calluserid, currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("end-recieve", (currentUserId) => {
        console.log(currentUserId);
      });
    }
  }, []);

  useEffect(() => {
    if (MyPeer) {
      MyPeer.on("open", (id) => {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            const call = MyPeer.call(calluserid, stream);
            myVideo.muted = true;
            addVideoStream(myVideo, stream);
            if (call) {
              call.on("stream", (remoteStream) => {
                addVideoStream(currentVideoCall, remoteStream);
              });
            }
          });
      });
    }
  }, [MyPeer]);

  return (
    <Container>
      <div className="videocall-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src="https://avatars.dicebear.com/api/micah/:242.svg"
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3> Bao Minh </h3>
          </div>
        </div>
      </div>
      <div className="videocall-content">
        <video className="myVideo"></video>
        {isEndCall && <h3>End call</h3>}
        <video className="currentVideoCall"></video>
      </div>
      {!isEndCall && (
        <div className="videocall-action">
          <div className="endCall" onClick={() => handleEndCall(MyPeer)}>
            <MdCallEnd />
          </div>
        </div>
      )}
    </Container>
  );
}
const Container = styled.div`
  background-color: #0a0a0a;
  display: grid;
  grid-template-rows: 8% 81% 11%;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  .videocall-content {
    h3 {
      color: white;
      position: absolute;
      top: 50%;
      right: calc(50% - 35px);
      font-size: 35px;
    }
    .myVideo {
      width: 20vw;
      height: 20vh;
      border: 1px solid white;
      display: block;
      position: fixed;
      top: 3px;
      right: 3px;
    }
    .currentVideoCall {
      width: 100%;
      height: 100%;
    }
  }
  .videocall-header {
    background-color: #080420;
    display: flex;
    align-items: center;
    padding: 5px 1rem;
    .user-details {
      display: flex;
      align-items: center;
      height: 70%;
      gap: 1rem;
      .avatar {
        img {
          border: 2px solid #4e0eff;
          border-radius: 50px;
          padding: 3px;
          height: 2.5rem;
          background-color: #f3f3f35c;
        }
      }
      .username {
        min-width: 85px;
        h3 {
          color: white;
        }
      }
    }
  }
  .videocall-action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    .endCall {
      height: 3.5rem;
      width: 3.5rem;
      border-radius: 50px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ce0c0c;
      transition: 0.2s ease-in;
      &:hover {
        transition: 0.2s ease-in;
        opacity: 0.8;
      }
      svg {
        font-size: 30px;
        color: white;
      }
    }
    .offCam {
      background-color: #9186f3;
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 50px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s ease-in;
      svg {
        font-size: 20px;
        color: white;
      }
      &:hover {
        transition: 0.2s ease-in;
        opacity: 0.8;
      }
    }
    .offMic {
      background-color: #9186f3;
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 50px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s ease-in;
      svg {
        font-size: 20px;
        color: white;
      }
      &:hover {
        transition: 0.2s ease-in;
        opacity: 0.8;
      }
    }
  }
`;
export default VideoCall;
