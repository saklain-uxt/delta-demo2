
const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{

   const allListings=  await Listing.find({});

   res.render("listing/index",{allListings});
};



module.exports.renderNewForm=(req,res)=>{
 
  res.render("listing/new.ejs");
};



module.exports.showListing=async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
     req.flash("error","listing not found!");
     return res.redirect("/listings");
  }
  res.render("listing/show",{listing});

}
module.exports.createListing=async(req,res,next)=>{
 try{
  let url="";
  let filename="";
  if(req.file){
    url=req.file.path;
    filename=req.file.filename;
  }

   let newListing=new Listing(req.body.listing);
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   await newListing.save();
   req.flash("success","New Listing Created!");
   res.redirect("/listings");
 }catch(err){
   console.error("Error creating listing:", err);
   req.flash("error","Failed to create listing: "+err.message);
   res.redirect("/listings/new");
 }

  // console.log
  // (newList
}

module.exports.editListing=async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
    if(!listing){
     req.flash("error","listing not found!");
      res.redirect("/listing");
  }

 let originalImageUrl= listing.image.url;
 originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");

  res.render("listing/edit.ejs",{listing,originalImageUrl});
  
};

module.exports.updateListing=async(req,res)=>{
  let {id}=req.params;

 let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
 if(typeof req.file!="undefined"){
  let url=req.file.path;
 let filename=req.file.filename;
 listing.image={url,filename};
 await listing.save();
 }
   req.flash("success","listing updated!");
  res.redirect(`/listings/${id}`);

  
};
module.exports.destroyListing=async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted!");
  res.redirect("/listings");
  
}

