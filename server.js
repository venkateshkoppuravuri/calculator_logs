const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

// localhost port
const port = process.env.PORT || 3001;

const app = express();

// server instance
const server = http.createServer(app);

// creates socket using the instance of the server
const io = socketIO(server);

// on connection with the socket
io.on("connection", socket => {
  // emitting the event to store the socketId
  io.emit("getSocketId", socket.id);

  // on emit of the equals event receiving from the client
  socket.on("equals", log => {
    io.emit("emitted-equals", log);
  });

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

});

/* running the react app using the build of create-react-app */
app.use(express.static("client/build"));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));