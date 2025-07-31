
if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}


const express=require('express');
const app=express();
const mongoose = require('mongoose');


const path = require('path');
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");


// const wrapAsync=require("./utils/wrapasync.js"); 
 const ExpressError=require("./utils/ExpressErro.js"); 
// const {listingSchema,reviewSchema}=require("./schema.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash = require("connect-flash");
 const Review= require('./models/review.js'); 
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");







// const Listing = require('./models/listing.js'); // Assuming you have a listing model defined in models/listing.js
//const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;
main()
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err)=>{
      console.log('Error connecting to MongoDB', err)
})



async function main() {
  await mongoose.connect(dbUrl);
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride('_method')); // Middleware to support PUT and DELETE methods in forms
app.engine("ejs",ejsMate);
app.use(express.json());
 //app.use(express.static(path.join(__dirname, 'public')));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
     secret:process.env.SECRET,

  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR in MONGO STORE",err);
});






const sessionOptions={
  store,
    secret:process.env.SECRET,
            resave:false,
            saveUninitialized:true,
            cookie:{
              
              expires:Date.now()+ 7*24*60*60*1000,
                maxAge: 7*24*60*60*1000,
                httpOnly:true,
            },



};









app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.session()); // Initialize Passport session management

// app.use(passport.session()); // Initialize Passport session management
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.get('/',(req,res)=>{
    res.redirect('/listings');
});

// const validateListing=(req,res,next)=>{
//    let {error}=listingSchema.validate(req.body);
//    console.log(error);

//   if(error){
//     throw new ExpressError(400,error);
//   }else{
//     next();
//   }

// };

// const validateReview=(req,res,next)=>{
//    let {error}=reviewSchema.validate(req.body);
//    console.log(error);

//   if(error){
//     throw new ExpressError(400,error);
//   }else{
//     next();
//   }

// };

app.use((req,res,next)=>{
  res.locals.sucsess=req.flash("sucsess");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;

  next();
})

// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"saklain@getMaxListeners.com",
//     username:"delta-student"
//   });
//   let registerUser=await User.register(fakeUser,"hello");
//   res.send(registerUser);
// })





app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);




//index routing
// app.get("/listings", wrapAsync(async(req,res)=>{
//    const allListings=  await Listing.find({});
//    res.render("listing/index",{allListings});
    
// }));

// Route to create a new listing


// app.get("/listings/new",(req,res)=>{
//   res.render("listing/new.ejs");
// });

//show route for individual listing
// app.get("/listings/:id", wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   const listing=await Listing.findById(id).populate("reviews");
//   res.render("listing/show",{listing});

// }));
//create route to save new listing
// app.post("/listings",validateListing, wrapAsync (async(req,res,next)=>{
 
//   let newListing=new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");

  
// }));



//edit route

// app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   const listing=await Listing.findById(id);
//   res.render("listing/edit.ejs",{listing});
  
// }));
//update route
// app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   await Listing.findByIdAndUpdate(id, {...req.body.listing});
//   res.redirect(`/listings/${id}`);

  
// }));

//delete route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
  
// }));


// // create review route
//  app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
 
//   let listings=await Listing.findById(req.params.id);
//   let newReview=new Review(req.body.review);
//   listings.reviews.push(newReview);

//   await newReview.save();
//   await listings.save();
//  res.redirect(`/listings/${listings._id}`)
  
// }));

// // Delete review route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//   let{id ,reviewId}=req.params;
//  let pp= await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//  let rs= await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listings/${id}`);
//   console.log(rs);
//   console.log(pp);




// }));







// app.all("*",(req, res, next)=>{
//   next(  new ExpressError(404,"wrong"))
// });

 //middle ware
 app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went weong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  

 
})







// app.get("/testlisting",async(req,res)=>{

//   let sampleLisitng=new Listing({
//       title:"Sample Listing",
//       description:"This is a sample listing for testing purposes.",
//       price:100,
//       location:"Sample Location",
//       image:"https://unsplash.com/photos/a-person-hikes-towards-a-house-in-the-mountains-NRSqHq7gLbM",
//       country:"Sample Country"
//   });

// await sampleLisitng.save();
// console.log("saved sample");
// res.send("server is listing");

  

// });
app.listen(8080,()=>{
      console.log('Server is running on port 8080');
});