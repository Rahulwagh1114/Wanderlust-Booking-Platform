const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
   image:{
    filename:String,
    url:{
        type:String,
        default:"https://images.unsplash.com/photo-1775922428717-fe41d4ce5751"
    }
},
    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;