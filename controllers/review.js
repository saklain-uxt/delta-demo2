
const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
 
  let listings=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  console.log(newReview);
  listings.reviews.push(newReview);

  await newReview.save();
  await listings.save();
   req.flash("success","New review Created!");
 res.redirect(`/listings/${listings._id}`)
  
}


module.exports.destroyReview=async(req,res)=>{
  let{id ,reviewId}=req.params;
 let pp= await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
 let rs= await Review.findByIdAndDelete(reviewId);
  req.flash("success","review deleted!");
  res.redirect(`/listings/${id}`);
  console.log(rs);
  console.log(pp);




}