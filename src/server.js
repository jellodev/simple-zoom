import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const port = 3000;
const handleListen = () => console.log(`Listening on port ${port}`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enterRoom", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("newMessage", (message, roomName, done) => {
    socket.to(roomName).emit("newMessage", message);
    done();
  });

  socket.on("disconnecting", (reason, description) => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye");
    });
  });
});

httpServer.listen(port, handleListen);
