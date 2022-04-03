const express = require("express")
const app=express()
const server=require("http").Server(app)
const io=require("socket.io")(server)
const{v4:idgen}=require("uuid")

app.set("view engine","ejs")
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.redirect(`/${idgen()}`)
})

app.get("/:room",(req,res)=>{
    res.render("room",{roomId:req.params.room})
})

io.on("connection",socket=>{
    socket.on("join-room",(roomId,userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("user-connected",userId)
    })
})
server.listen(process.env.port||3000)

