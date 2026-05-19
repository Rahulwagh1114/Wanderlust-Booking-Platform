const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require('path');
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

app.engine("ejs",ejsMate);

const methodOverride = require("method-override");
const { error } = require("console");
app.use(methodOverride("_method"));

//express session
const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
      maxAge:7 * 24 * 60 * 60 * 1000,
      httpOnly:true
    }
};
app.use(session(sessionOptions));


//Flash used for showing message 

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

//dataBase connection

const MONGO_URL="mongodb://localhost:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("error connecting to database",err);
});

//middlewares 
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));     
app.listen(port,()=>{
    console.log("port is listing");
})

//Routes connections
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)

app.get("/",(req,res)=>{
    res.send("Root path");
})

//Express errors handler
app.use((req, res, next) => {
    next(new ExpressError(404,"Page Not Found!"));
});

//Error handler

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
});

