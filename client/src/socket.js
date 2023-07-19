import io from "socket.io-client";
let socketio = io("http://127.0.0.1:5000/");
export default socketio;
