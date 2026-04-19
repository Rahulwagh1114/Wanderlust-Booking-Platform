const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require('path');
const ejsMate=require("ejs-mate");

app.engine("ejs",ejsMate);

const methodOverride = require("method-override");
app.use(methodOverride("_method"));



const MONGO_URL="mongodb://localhost:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("error connecting to database",err);
});
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));     
app.listen(port,()=>{
    console.log("port is listing");
})

app.get("/",(req,res)=>{
    res.send("Root path");
})


app.get("/listings",async(req,res)=>{
const allListing=await Listing.find({});
res.render("listing/index.ejs",{allListing});
});

//New route
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
})

//show routes
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
 const listing=await Listing.findById(id);
 res.render("listing/show.ejs",{listing});
});

//create route
app.post("/listings",async(req,res)=>{
    const newListing= await new Listing (req.body.listing);
     await newListing.save();
     res.redirect("/listings");
})

//Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
 const listing=await Listing.findById(id);
 res.render("listing/edit.ejs",{listing});
})

//update route
app.put("/listings/:id",async(req,res)=>{
 let {id}=req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect(`/listings/${id}`);
});


//delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

