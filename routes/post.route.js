const express =require("express")
const postRouter = express.Router()

const {PostModel} =require("../model/post.model")
const jwt = require("jsonwebtoken")

postRouter.get("/",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token,"masai")
    try {
        if(decoded){
            console.log(decoded)
            const posts = await PostModel.find({"userID":decoded.userID})
            res.status(200).send(posts)
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

postRouter.post("/add",async(req,res)=>{
    try {
        const posts = new PostModel(req.body)
        await posts.save()
        res.status(200).send({"msg":"Added a new post"})
    } catch (error) {
        res.status(200).send({"msg":error.message})
    }
})

postRouter.delete("/delete/:postID",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token,"masai")
    const postID = req.params.postID
    const req_id = decoded.userID
    const post = await PostModel.findOne({_id:postID})
    const userID_in_post = post.userID
    try {
        if(req_id===userID_in_post){
            await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).send({"msg":"deleted post"})
        }
    } catch (error) {
        res.status(200).send({"msg":error.message})
    }
})

postRouter.patch("/update/:postID",async(req,res)=>{
    const payload = req.body
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token,"masai")
    const postID = req.params.postID
    const req_id = decoded.userID
    const post = await PostModel.findOne({_id:postID})
    const userID_in_post = post.userID
    try {
        if(req_id===userID_in_post){
            await PostModel.findByIdAndUpdate({_id:postID},payload)
            res.status(200).send({"msg":"deleted post"})
        }
    } catch (error) {
        res.status(200).send({"msg":error.message})
    }
})
module.exports = {postRouter}