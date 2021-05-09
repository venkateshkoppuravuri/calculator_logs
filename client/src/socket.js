import io from "socket.io-client";

// localhost port
const port = 3176;

const socketUrl =  `http://localhost:${port}`;

export const socket = io.connect();