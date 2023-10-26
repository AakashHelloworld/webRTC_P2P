const server = 4000;
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
  });



io.on("connection", (socket)=>{
    console.log(socket.id)

    socket.on("send-userId-roomid", ({name, roomId})=>{
        console.log(name, roomId)
        io.to(roomId).emit("user:joined", { name, id: socket.id });
        socket.join(roomId);
        io.to(socket.id).emit("room:join", {name, roomId});
    })

})