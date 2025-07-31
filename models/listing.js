const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require("./review.js");


const listingSchema=new Schema({
      title:{
            type:String,
            required:true
      },
      description:{
            type:String,
            required:true
      },
      price:{
            type:Number,
            required:true
      },
      location:{
            type:String,
            required:true
      },
      image:{
            // type:String,
            // required:true,
            // default:"https://unsplash.com/photos/a-person-hikes-towards-a-house-in-the-mountains-NRSqHq7gLbM",

            // set:(v)=> v===""? "https://unsplash.com/photos/a-person-hikes-towards-a-house-in-the-mountains-NRSqHq7gLbM" : v ,// Default image if none provided
              
               url:String,
               filename:String,
               
            
            
      },
      country:{
            type:String,
            required:true
      },
      reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review"
      },
],
      owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
      },


});
listingSchema.post("findOneAndDelete",async (listing)=>{
      if(listing){
           let kk= await Review.deleteMany({_id:{$in:listing.reviews}});
           console.log(kk);
      }
})


const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;

