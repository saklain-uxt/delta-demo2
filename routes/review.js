const express=require("express");
const router=express.Router({mergeParams:true}); //mergeparams seek some info from parent to child route 
const wrapAsync=require("../utils/wrapasync.js"); 
const ExpressError=require("../utils/ExpressErro.js"); 
const {listingSchema,reviewSchema}=require("../schema.js");
const{isLoggedIn,isReviewAuthor}=require("../middlewear.js")
 const Review= require('../models/review.js');
 const Listing = require('../models/listing.js');
 const reviewController = require('../controllers/review.js');





 const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
 
   if(error){
     throw new ExpressError(400,error);
   }else{
     next();
   }
 
 };



// create review route
 router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;
