import io from "socket.io-client";
let socketio = io("http://localhost:5000");
export default socketio;
