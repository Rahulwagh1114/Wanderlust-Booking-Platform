const Listing=require("../models/listing.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// index of listing
// module.exports.index=async(req,res)=>{        //old code without filter
// const allListing=await Listing.find({});
// res.render("listing/index.ejs",{allListing});
// }



module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  if (category) {
    filter.category = category.replaceAll("-", " ");
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ];
  }

  const allListing = await Listing.find(filter);

  res.render("listing/index.ejs", { allListing });
};


// new listing req
module.exports.newListing=(req,res)=>{
    res.render("listing/new.ejs");
};

// show listing 
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
 const listing=await Listing.findById(id).populate({ path:"reviews",populate:{path:"author"}}).populate("owner");
 if(!listing){
    req.flash("error","You Requested For Listing Does Not Exist .!");
     return res.redirect("/listings")
 }
 res.render("listing/show.ejs",{listing});
};


// create listing
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let categoryName=req.body.listing.category;

  const newListing = new Listing(req.body.listing);

  // geocoding feature
 const searchQuery = `${newListing.location}, ${newListing.country}`;

const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
  searchQuery
)}&limit=1`;

const geoRes = await fetch(geoUrl, {
  headers: {
    "User-Agent": "wanderlust-project",
  },
});

const geoData = await geoRes.json();

if (geoData.length > 0) {
  newListing.geometry = {
    type: "Point",
    coordinates: [
      Number(geoData[0].lon),
      Number(geoData[0].lat),
    ],
  };
}
 newListing.category=categoryName
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
 
  await newListing.save();
  req.flash("success", "New Listing Created .!");
  res.redirect("/listings");
};


// edit listing req
module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
 const listing=await Listing.findById(id);
 
 if(!listing){
    req.flash("error","You Requested For Listing Does Not Exist .!");
     return res.redirect("/listings")
 }
let originalImageUrl=listing.image.url;
originalImageUrl=originalImageUrl.replace("/upload" ,"/upload/,w_250");

 res.render("listing/edit.ejs",{listing, originalImageUrl});
}

//// Update listing
module.exports.updateListing= async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // Agar image field empty ho to purana URL use karo
    let imageUrl = req.body.listing.image;
    if (!imageUrl || imageUrl.trim() === "") {
        imageUrl = listing.image.url;
    }
   let listingUpdate= await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        image: {
            url: imageUrl,
            filename: "listingimage"
        }
    });
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
    let filename=req.file.filename;
    listingUpdate.image={url,filename}
    await listingUpdate.save();
    }
     req.flash("success","Listing Updated .!");
    res.redirect(`/listings/${id}`);
}


// Delete listing
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    const deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success","Listing Deleted .!");
    res.redirect("/listings");
}