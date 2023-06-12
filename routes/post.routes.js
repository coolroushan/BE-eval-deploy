const express=require("express")
const {auth}=require("../middleware/auth.middleware")
const {PostModel}=require("../model/post.model")
const jwt=require("jsonwebtoken")
require("dotenv").config()

const postRouter=express.Router()

postRouter.use(auth)

postRouter.post("/add",async(req,res)=>{
    try{
        const post=new PostModel(req.body)
        await post.save()
        res.status(200).json({msg:"Post has been added", post:req.body})
    }catch(err){
        res.status(400).json({err:err.message})
    }
})
postRouter.get("/",async(req,res)=>{
    try {
        const post= await PostModel.find({userId:req.body.userId})
        res.status(200).json({post})
        
    } catch (error) {
        res.status(400).json({err:err.message})
    }
    
})

postRouter.patch("/update/:postID",async(req,res)=>{
    const userDocId=req.body.userID
    const {postID}=req.params
    try {
        const post=await PostModel.findOne({_id:postID});
        const userPostId=post.userID

        if(userDocId===userPostId){
            await PostModel.findByIdAndUpdate({_id:postID},req.body)
            res.status(200).json({msg:"post has been updated"})
        }else{
            res.status(200).json({msg:"Not Authorized"})
        }
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }
    
    
})
postRouter.delete("/delete",async(req,res)=>{
    const userDocId=req.body.userID
    const {postID}=req.params
    try {
        const post=await PostModel.findOne({_id:postID});
        const userPostId=post.userID

        if(userDocId===userPostId){
            await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).json({msg:"post has been deleted"})
        }else{
            res.status(200).json({msg:"Not Authorized"})
        }
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


postRouter.get("/page/:pagenum",async(req,res)=>{
    const Page_Size=3
    const {pagenum}=req.params
    try {
        const post=await PostModel.find({}).skip((pagenum-1)*Page_Size).limit(Page_Size)
        res.status(200).json({post})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.get("/top",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    const decoded=jwt.verfify(token,process.env.secret)
    try {
        const post=await PostModel.find({userID:decoded.userID}).sort({"no_of_comments":-1}).limit(1)
        res.status(200).json({post})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.get("/top/:pagenum",async(req,res)=>{
    const Page_Size=3
    const {pagenum}=req.params
    try {
        const post=await PostModel.find({}).skip((pagenum-1)*Page_Size).limit(Page_Size)
        res.status(200).json({post})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

module.exports={
    postRouter
}