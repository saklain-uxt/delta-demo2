const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js"); 
const ExpressError=require("../utils/ExpressErro.js"); 
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn,isOwner}=require("../middlewear.js");
const listingController=require("../controllers/listing.js");
const Listing = require('../models/listing.js');
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
 
const validateListing=(req,res,next)=>{
   let {error}=listingSchema.validate(req.body);
   console.log(error);

  if(error){
    throw new ExpressError(400,error);
  }else{
    next();
  }

};




 






router.route("/").
get(wrapAsync(listingController.index))

 .post(isLoggedIn,upload.single("listing[image]"), wrapAsync (listingController.createListing)
);

// );
// Route to create a new listing
// .post(upload.single("listing[image]"),(req,res)=>{
//   res.send(req.file);




router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing)

)
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn ,isOwner,wrapAsync(listingController.destroyListing))


//index routing
// router.get("/", wrapAsync(listingController.index)
// );
// Route to create a new listing


//router.get("/new",isLoggedIn,listingController.renderNewForm);
//show route for individual listing
// router.get("/:id", wrapAsync(listingController.showListing)

// );

//create route to save new listing
// router.post("/",isLoggedIn,validateListing, wrapAsync (listingController.createListing)


// );

//edit route

router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync(listingController.editListing))

//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing)
// );


//delete route
// router.delete("/:id",isLoggedIn ,isOwner,wrapAsync(listingController.destroyListing));
  module.exports=router;
