const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Get routes of post")
})

router.post("/",(req,res)=>{
    res.send("Post route of post")
})

router.get("/:id",(req,res)=>{
    res.send("Delete routr of post");
})

module.exports=router;