const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const morgan = require("morgan");
const socket = require("socket.io");
const path = require("path");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.static(path.join(__dirname, "./build")));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res, rej) => console.log("Connect successfully!"))
  .catch((err) => console.log(err.message));

const server = app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000"],
    Credential: true,
  },
});

global.onlineUsers = new Map();
let onlines = [];

io.on("connection", (socket) => {
  global.chatSocket = socket;
  const newConnectUserId = socket.handshake.query.userId;

  if (newConnectUserId && !onlines.includes(newConnectUserId)) {
    onlines.push(newConnectUserId);
  }

  io.emit("online-user", onlines);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    let disconnectUserId = undefined;
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        disconnectUserId = key;
        return;
      }
    });

    onlineUsers.delete(disconnectUserId);

    onlines = onlines.filter((pre) => pre !== disconnectUserId);

    io.emit("online-user", onlines);
  });

  socket.on("logout", (currentUser) => {
    onlineUsers.delete(currentUser._id);
    onlines = onlines.filter((pre) => pre !== currentUser._id);
    io.emit("online-user", onlines);
    socket.disconnect();
  });

  socket.on("make-call", (userBeCallId, currentUserId) => {
    const sendUserSocket = onlineUsers.get(userBeCallId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("call-recieve", currentUserId);
    }
  });

  // socket.on("end-call", (userBeCallId) => {
  //   const sendToUserSocket = onlineUsers.get(userBeCallId);
  //   if (sendToUserSocket) {
  //     io.to(sendToUserSocket).emit("end-recieve", userBeCallId);
  //   }
  // });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
