const User=require("../models/user.js");

//signup req form
module.exports.signupRenderForm=(req,res)=>{
    res.render("users/signup.ejs")
    
}

//signup 
module.exports.signup=async(req,res)=>{
    try{  
       let {username,email,password}=req.body;
       const newUser=new User ({username,email});
       const registeredUser=await User.register(newUser,password);
       req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
         req.flash("success","Welcome To Wanderlust !");
       res.redirect("/listings");
       })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//login form req
module.exports.loginRenderForm=(req,res)=>{
    res.render("users/login.ejs");
};

//login form
module.exports.login=async(req,res)=>{
       req.flash("success","Welcome back to Wanderlust !");
       let redirectUrl=res.locals.redirectUrl || "/listings";
       res.redirect(redirectUrl);
}

//logout form
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}