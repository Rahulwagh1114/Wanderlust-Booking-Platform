const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
       if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
       }else{
        next();
       }
}

router.get("/",wrapAsync(async(req,res)=>{
const allListing=await Listing.find({});
res.render("listing/index.ejs",{allListing});
}));

//New route
router.get("/new",(req,res)=>{
    res.render("listing/new.ejs");
})

//show routes
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
 const listing=await Listing.findById(id).populate("reviews");
 if(!listing){
    req.flash("error","You Requested For Listing Does Not Exist .!");
     return res.redirect("/listings")
 }
 res.render("listing/show.ejs",{listing});
}));

//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
       const newListing= await new Listing (req.body.listing);
     await newListing.save();
     req.flash("success","New Listing Created .!");
     res.redirect("/listings");
    
}));

//Edit route
router.get("/:id/edit",wrapAsync( async (req,res)=>{
    let {id}=req.params;
 const listing=await Listing.findById(id);
 
 if(!listing){
    req.flash("error","You Requested For Listing Does Not Exist .!");
     return res.redirect("/listings")
 }
 res.render("listing/edit.ejs",{listing});
}));

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;

    let listing = await Listing.findById(id);

    // Agar image field empty ho to purana URL use karo
    let imageUrl = req.body.listing.image;

    if (!imageUrl || imageUrl.trim() === "") {
        imageUrl = listing.image.url;
    }

    await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        image: {
            url: imageUrl,
            filename: "listingimage"
        }
    });
     req.flash("success","Listing Updated .!");

    res.redirect(`/listings/${id}`);
}));


//delete Route
router.delete("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success","Listing Deleted .!");
    res.redirect("/listings");
}));

module.exports=router;