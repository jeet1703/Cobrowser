const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

io.on("connection", (socket) => {
  console.log('a user connected with id:', socket.id);
  
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("mouse_move", (data) => {
    socket.broadcast.emit("mouse_move", data);
  });

  socket.on("mouse_click", (data) => {
    socket.broadcast.emit("mouse_click", data);
  });

  socket.on("url_change", (data) => {
    socket.broadcast.emit("url_change", data);
  });

  socket.on("scroll", (data) => {
    socket.broadcast.emit("scroll", data);
  });

  socket.on("button_click", (data) => {
    socket.broadcast.emit("button_click", data);
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
