const server = 4000;
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
  });



io.on("connection", (socket)=>{

    socket.on("send-userId-roomid", ({name, roomId})=>{
        // console.log(name, roomId)
        io.to(roomId).emit("user:joined", { name, id: socket.id });
        socket.join(roomId);
        io.to(socket.id).emit("room:join", {name, roomId});
    })
    socket.on("call:sendoffer", ({tonext, offer})=>{
        // console.log(tonext, offer)
        io.to(tonext).emit("collect:offer", {from:socket.id, offer} )
})

    socket.on("call:sendAnswer", ({tonext, Answer})=>{
        // console.log(tonext, Answer
        io.to(tonext).emit("collect:pleaseAcceptAnswer", {from:socket.id, Answer} )
    })

    socket.on("peer:nego:needed", ({to, offer})=>{
        io.to(to).emit("peer:nego:needed", {from:socket.id, offer})
    })

    socket.on("peer:nego:done", ({to, ans})=>{
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    })

})


