const {log} = require("console");
const express = require("express");
const app = express();
const http = require("http");
const {userInfo} = require("os");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const cors = require('cors');

const corsOptions = {
  origin: '*', // Add your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

const userList = [];

app.get("/", (req, res) => {
    res.send('<h1>Hello world</h1>')
});

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("connectedNewUser", (data) => {
        const index = userList.findIndex((el) => el.id === data.id);

        if (index >= 0) {
            userList[index] = {...data, socketId: socket.id}
            console.log("enter if", index);

        } else {
            userList.push({...data, socketId: socket.id})
            console.log("enter else", index);
        }

        console.log("userList", userList);

    });

    socket.on("newMessageSend", (data) => {
        const sortedUser = []
        data.members.forEach((member) => {
            if (userList.some( u => member.user_id == u.id )){
                sortedUser.push(userList.find(u => member.user_id == u.id  ))
            }
        })

        sortedUser.forEach((user) => {
            console.log("user.socketId", user.socketId)
            io.to(user.socketId).emit("newMessage", data); // `user.socketId` must be the correct connected Socket.IO ID
        });
    });

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`,
            userList.find(u => u.socketId = socket.id));
        userList.splice(userList.findIndex(u => u.socketId = socket.id), 1);
    });
});

server.listen(8080, () => {
    console.log("listening on *:8080");
});
