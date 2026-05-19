const express = require("express");
const app = express();
const path=require('path');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const users = require("./routes/user.js");
const post = require("./routes/post.js");

const session=require("express-session");
const flash=require("connect-flash");

app.use(flash());
app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));
app.get("/test",(req,res)=>{
    res.send("test successful");
})

app.use((req,res,next)=>{
 res.locals.successMsg=req.flash("success")
  res.locals.errorMsg=req.flash("error")
  next();
})

app.get("/countsession",(req,res)=>{
    if(req.session.count){
       req.session.count++;
    }else{
        req.session.count=1;
    }
    
    res.send(`You sent a request ${req.session.count} times. `)
})

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","User not register")
    }else{
         req.flash("success","User registerd successfully");
    } 
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name,});

})


//cookies part 1st lecture
// const cookieParser = require("cookie-parser");

// // yahi enough hai
// app.use(cookieParser("secretcode"));

// app.use("/users", users);
// app.use("/post", post);

// app.get("/getcookies", (req, res) => {
//     res.cookie("Greet", "Namaaste");
//     res.cookie("madeIn", "India");
//     res.send("Cookies are sent to you");
// });

// app.get("/getsignedcookies", (req, res) => {
//     res.cookie("madeIn", "India", { signed: true });
//     res.send("cookies signed");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send(req.signedCookies);
// })

// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     console.dir(req.signedCookies);

//     res.send("I am root");
// });







app.listen(3000, () => {
    console.log("port is listening");
});