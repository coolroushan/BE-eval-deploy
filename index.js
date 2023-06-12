const express=require("express")
const {connect}=require("./db")
const cors=require("cors")
const {postRouter}=require("./routes/post.routes")
const {userRouter}=require("./routes/user.routes")
require("dotenv").config()

const app=express()
app.use(cors())

app.use(express.json())



app.use("/users", userRouter)
app.use("/posts",postRouter)

app.listen(process.env.port,async()=>{
try {
    await connect
    console.log("Now DB is connected")
    console.log(`Server is running at port ${process.env.port}`)
} catch (error) {
    console.log(error.message)
}
})