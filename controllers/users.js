const User =require("../models/user.js");

module.exports.signup=async (req,res)=>{
    try{
   let{username,email,password}=req.body;
   const newUser= new User({email,username});
   const registeredUser = await User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
   req.flash("success","WELCOME TO WANDERLUST");
   res.redirect("/listings");
});
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.login=async (req,res)=>{
    req.flash("success","WELCOME BACK IN WANDERLUST")
    let redirectUrl=res.locals.redirectUrl||"/listings";
    if(redirectUrl.includes("/reviews/")){
        redirectUrl=redirectUrl.split("/reviews/")[0];
    }
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};


module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you logged you out successfully!");
        res.redirect("/listings");
    });
};
