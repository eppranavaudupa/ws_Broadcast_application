const { json } = require('stream/consumers');
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

let allSocket = [];

wss.on("connection", function (Socket) {
    console.log(`User connected`);

    Socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "join") {
            console.log("USer joined room" + parsedMessage.payload.message)
            allSocket.push({
                Socket,
                room: parsedMessage.payload.roomid
            });
        }

        if (parsedMessage.type === "chat") {
            let currentUser = allSocket.find(user => user.Socket === Socket);
            if (!currentUser) return;

            let currentUserRoom = currentUser.room;

            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].room === currentUserRoom) {
                    allSocket[i].Socket.send(parsedMessage.payload.message);
                }
            }
        }
    });

    Socket.on("close", () => {
        allSocket = allSocket.filter(user => user.Socket !== Socket);
        console.log("User disconnected");
    });

    // Socket.send("This is sent by the server to all");
});
