const express=  require("express")
const userRouter = express.Router()

const jwt = require("jsonwebtoken")

const bcrypt = require("bcrypt")
const {UserModel} = require("../model/user.model")

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married} = req.body
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            const user = new UserModel({name,email,gender,password:hash,age,city,is_married})
           await  user.save()
            res.status(200).send({"msg":"Registration Completed"})
        })
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,password} =req.body
    try {
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    res.status(200).send({"msg":"Login Successfull","token":jwt.sign({"userID":user._id},"masai")})
                }
                else{
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            })
        }
        else{
            res.status(400).send({"msg":"Login again"})
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

module.exports = {userRouter}