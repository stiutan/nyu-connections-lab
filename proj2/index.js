import express from "express";
import http from "node:http";
import { Server } from "socket.io";

// initialize the express 'app' object
let app = express();
let server = http.createServer(app);
let io = new Server(server);

app.use("/", express.static("public"));

let users = {};

io.on("connection", (socket) => {
  console.log("We have a new user: " + socket.id);
  socket.emit("users", users);

  socket.on("user-log", (entry) => {
    // Remember profile info even before the user's first mouse movement.
    socket.data.user = { name: entry.name, color: entry.color };
    io.emit("user-log", entry);
  });

  // listen to updates from users
  socket.on("user-update", (updatedData) => {
    // add socket id for identification & update users
    let userData = { ...updatedData, id: socket.id };
    users[socket.id] = userData;

    // send updated data to client for ALL users (update their user lists)
    io.emit("user-data", userData);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user-disconnected", { id: socket.id, user: socket.data.user });
    console.log("A user has disconnected: " + socket.id);
  });
});

let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port: " + port);
});
