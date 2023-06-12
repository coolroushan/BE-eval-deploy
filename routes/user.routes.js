const express=require("express")
const bcrypt=require("bcrypt")
const {UserModel}=require("../model/user.model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married}=req.body
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.status(200).json({err:err.message})
            }else{
                const user=new UserModel({name,email,gender,password:hash,age,city,is_married})
                await user.save()
                res.status(200).json({msg:"New user has been added",user: req.body})
            }
        })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
      const user=await UserModel.findOne({email})
      if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                let token=jwt.sign({userID:user._id,user:user.name},process.env.secret,{ expiresIn: "7 days"})
                res.status(200).json({msg:"Logged in", token})
            }else{
                res.status(200).json({error:"wrong credentials"})
            }
        })
      }else{
        res.status(200).json({msg:"user not found"})
      }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


module.exports={
    userRouter
}