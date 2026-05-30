if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

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
const MongoStore = require("connect-mongo").MongoStore;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");

//dataBase connection

// const MONGO_URL="mongodb://localhost:27017/wanderlust";

const DB_URL=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(DB_URL);
}
main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("error connecting to database",err);
});

const methodOverride = require("method-override");
const { error } = require("console");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.engine("ejs",ejsMate);


const store=MongoStore.create ({
    mongoUrl:DB_URL,
    crypto:{
          secret:process.env.SECRET,
    },
    touchAfter:24*3600
})

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

//express session
const sessionOptions={
    store,
    secret:process.env.SECRET,
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

//Passport for Set password "Ham session ke baad use kar rahe because ek hi session par user ko login na karna pade bar bar (a browser tabs)"

app.use(passport.initialize());  //passport initialize 
app.use(passport.session());     //session me use ek hi baar login kare is liye
passport.use(new LocalStrategy(User.authenticate())); //user Local stratgy through authenticate ho 

passport.serializeUser(User.serializeUser());    //for both lines (use static serialize and deserialize of model for passport session support)
passport.deserializeUser(User.deserializeUser());  //serialized means stored info in session and deserlized means remove info from session
 

//middleware of flash and cuurUser for lofin singup
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


//middlewares 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,'public')));     

app.listen(port,()=>{
    console.log("port is listing");
})

//Routes connections
app.use("/listings/:id/reviews",reviewRouter)
app.use("/listings",listingRouter);
app.use("/",userRouter);


//Express errors handler
app.use((req, res, next) => {
    next(new ExpressError(404,"Page Not Found!"));
});

//Error handler

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
});