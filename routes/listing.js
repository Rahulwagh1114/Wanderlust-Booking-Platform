const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});


router
.route("/")
.get(wrapAsync(listingController.index))     //index 
.post(isLoggedIn,upload.single('listing[image]'),validateListing,
    wrapAsync(listingController.createListing)); //create route


//New route
router.get("/new",
    isLoggedIn,listingController.newListing);

router
.route("/:id")
.put(isLoggedIn,isOwner,                    //update route
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing)
)
.get(wrapAsync(listingController.showListing)  //show route
) 
.delete(isLoggedIn,isOwner, 
    wrapAsync(listingController.destroyListing)  //delete route
); 



//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingController.editListing));



module.exports=router;