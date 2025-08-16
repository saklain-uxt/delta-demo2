
const User=require("../models/user.js");





module.exports.renderSignupForm=(req,res)=>{
      res.render("user/signup.ejs");
}

module.exports.renderLoginForm=(req,res)=>{
      res.render("user/login.ejs");
}

module.exports.userSignup=async(req,res)=>{
      try{
             let{username,email,password}=req.body;
       const newUsernew= User({email,username});
       const registerUser=await User.register(newUsernew,password);
       console.log(registerUser);
       req.login(registerUser,(err)=>{
            if(err){
                  return next(err);
            }
              req.flash("success","Welcome to the community");
       res.redirect("/");

       });
     

      } catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
      }
      



}


module.exports.login=async(req,res)=>{
      req.flash("success","Welcome back");
      let redirectUrl=res.locals.redirectUrl ||"/listings";
      res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
      req.logout((err)=>{
            if(err){
                return  next(err);

            }
            req.flash("success","you are logout");
            res.redirect("/");
      })
        
}