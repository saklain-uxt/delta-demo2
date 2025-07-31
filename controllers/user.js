
const User=require("../models/user.js");





module.exports.renderSingupForm=(req,res)=>{
      res.render("user/singup.ejs");
}

module.exports.renderLoginForm=(req,res)=>{
      res.render("user/login.ejs");
}

module.exports.userSingup=async(req,res)=>{
      try{
             let{username,email,password}=req.body;
       const newUsernew= User({email,username});
       const registerUser=await User.register(newUsernew,password);
       console.log(registerUser);
       req.login(registerUser,(err)=>{
            if(err){
                  return next(err);
            }
              req.flash("sucsess","Welcome to the community");
       res.redirect("/");

       });
     

      } catch(e){
            req.flash("error",e.message);
            res.redirect("/singup");
      }
      



}


module.exports.login=async(req,res)=>{
      req.flash("sucsess","Welcome back");
      let redirectUrl=res.locals.redirectUrl ||"/listings";
      res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
      req.logout((err)=>{
            if(err){
                return  next(err);

            }
            req.flash("sucsess","you are logout");
            res.redirect("/");
      })
        
}