const express=require("express");
const router=express.Router();

router.get("/users",(req,res)=>{
    res.send("Get routes of user")
})

router.post("/users",(req,res)=>{
    res.send("Post route of user")
})

router.delete("/users/:id",(req,res)=>{
    res.send("Delete routr of user");
})

module.exports=router;