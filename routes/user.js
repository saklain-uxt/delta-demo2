const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapasync.js"); 
const passport=require("passport");
const { saveRedirectUrl } = require("../middlewear.js");
const userController=require("../controllers/user.js");

  


router.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.userSignup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
      failureRedirect:"/login",
      failureFlash:true,
}),userController.login
)


// router.get("/singup",userController.renderSingupForm);

// router.post("/singup", wrapAsync(userController.userSingup));

//router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{
//       failureRedirect:"/login",
//       failureFlash:true,
// }),
// userController.login

// );
router.get("/logout",userController.logout);






module.exports=router;