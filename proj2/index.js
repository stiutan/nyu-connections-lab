import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import { AccessToken } from "livekit-server-sdk";

// initialize the express 'app' object
let app = express();
let server = http.createServer(app);
let io = new Server(server);

app.use("/", express.static("public"));

let users = {};

io.on("connection", (socket) => {
  let userId = socket.id;

  console.log("We have a new user: " + userId);
  socket.emit("users", users);

  socket.on("user-log", (entry) => {
    // Remember profile info even before the user's first mouse movement.
    socket.data.user = { name: entry.name, color: entry.color };
    io.emit("user-log", entry);
  });

  // listen to updates from users
  socket.on("user-update", (updatedData) => {
    // add socket id for identification & update users
    let userData = { ...updatedData, id: userId };
    users[userId] = userData;

    // send updated data to client for ALL users (update their user lists)
    io.emit("user-data", userData);
  });

  // handle audio connection from a user
  socket.on("audio-token", async (reply) => {
    try {
      let token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        { identity: userId, ttl: "10m" },
      );

      token.addGrant({
        roomJoin: true,
        room: "the-floor",
        canPublish: true, // can send audio
        canSubscribe: true, // can receive audio
      });

      reply({
        token: await token.toJwt(), // token to signed string
        url: process.env.LIVEKIT_URL,
      });
    } catch (e) {
      console.error("Could not create audio token: " + e);
      reply({ error: "Could not enable audio." });
    }
  });

  socket.on("disconnect", () => {
    delete users[userId];
    io.emit("user-disconnected", { id: userId, user: socket.data.user });
    console.log("A user has disconnected: " + userId);
  });
});

let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port: " + port);
});
