import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/public/views")
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

const port = 3000;
const handleListen = () => console.log(`Listening on port ${port}`)

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from the browser"));
    socket.on("message", (message) => {
        if (Buffer.isBuffer(message)) {
            message = message.toString('utf8');
        }
        const { type, payload } = JSON.parse(message);
        switch (type) {
            case "new_message":
                sockets.forEach((savedSocket) => savedSocket.send(`${socket.nickname}: ${payload}`));
                break;
            case "nickname":
                socket["nickname"] = payload;
                break;
        }
    })
})

server.listen(port, handleListen);