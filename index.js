const express = require("express")
const {connection} = require("./config/db")
const cors = require("cors")
const {userRouter}= require("./routes/user.route")
const { postRouter } = require("./routes/post.route")
const { auth } = require("./middleware/auth.middleware")

const app =express()
app.use(express.json())
app.use(cors())
app.get("/",(req,res)=>{
    res.send("Home Page")
})
app.use("/users",userRouter)
app.use(auth)
app.use("/posts",postRouter)
app.listen(3000,async()=>{
    try {
        await connection
        console.log("connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log("connected to port 3000")
})