const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const controllerUser=require("../controllers/user.js");


router
.route("/signup")
.get(controllerUser.signupRenderForm)     //sign form req route
.post(wrapAsync(controllerUser.signup)); //sign form


router
.route("/login")
.get(controllerUser.loginRenderForm)    //login form req route
.post(                                  // login form
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:"/login",failureFlash:true})
        ,controllerUser.login);


//logout router
router.get("/logout",controllerUser.logout)


module.exports=router;