const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const sessions = {};

io.on("connection", (socket) => {
  console.log("a user connected with id:", socket.id);

  socket.on("join_session", (data) => {
    const { sessionId } = data;

    sessions[sessionId] = socket.id;
    console.log(`User with socket ID ${socket.id} joined session ${sessionId}`);
    socket.join(sessionId);
  });

  socket.on("mouse_move", (data) => {
    const { sessionId, x, y } = data;
    socket.to(sessionId).emit("mouse_move", { x, y });
  });

  socket.on("mouse_click", (data) => {
    const { sessionId, buttonId } = data;
    socket.to(sessionId).emit("mouse_click", { buttonId });
  });

  socket.on("url_change", (data) => {
    const { sessionId, url } = data;
    socket.to(sessionId).emit("url_change", { url });
  });

  socket.on("scroll", (data) => {
    const { sessionId, scrollTop, scrollLeft } = data;
    socket.to(sessionId).emit("scroll", { scrollTop, scrollLeft });
  });

  socket.on("button_click", (data) => {
    const { sessionId, color } = data;
    socket.to(sessionId).emit("button_click", { color });
  });

  socket.on("offer", (data) => {
    const { sessionId, offer } = data;
    socket.to(sessionId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    const { sessionId, answer } = data;
    socket.to(sessionId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    const { sessionId, candidate } = data;
    socket.to(sessionId).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
