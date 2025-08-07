import { Server } from 'socket.io'
import http from 'http'
import { app } from '../app.js'

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        credentials: true
    }
});

const UsersSocketIds = {};

const GetOnlineUser = (userId) => {
    return UsersSocketIds[userId];
}

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;
    UsersSocketIds[userId] = socket.id;

    socket.emit("onlineUsers", Object.keys(UsersSocketIds))

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete UsersSocketIds[userId];
    })
})

export { io, server, GetOnlineUser }