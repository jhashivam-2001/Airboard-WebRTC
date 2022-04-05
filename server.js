const express = require("express")
const app=express()
const server=require("http").Server(app)
const io=require("socket.io")(server)
const{v4:idgen}=require("uuid")
require('dotenv').config()

app.set("view engine","ejs")
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.redirect(`/${idgen()}`)
})

// app.get("/track",(req,res)=>{
//     res.render("track")
// })

app.get("/paint",(req,res)=>{
    res.render("paint",{title:"Airboard"})
})

app.get("/:room",(req,res)=>{
    res.render("room",{roomId:req.params.room,title:"Airboard", ws_url:process.env.WS_URL+"/ws/board/1"})
})

io.on("connection",socket=>{
    socket.on("join-room",(roomId,userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("user-connected",userId)
    })
    socket.on("render-img",(res1,res2,res4,roomId)=>{
        socket.broadcast.to(roomId).emit("update-canvas",res1,res2,res4)
    })
})
server.listen(process.env.port||3000)

