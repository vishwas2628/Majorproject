import {User} from '../models/user.js';

const renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
};

const userSignup = async(req,res,next)=>{
    try{
        let {username, email, password}= req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to WonderList");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

const renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

const userLogin = async(req,res)=>{
    req.flash('success', "Welcome back to WonderList");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
   //  res.redirect("/listings");
};

const userLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
};

export const usersController = {
    renderSignup,
    userSignup,
    renderLoginForm,
    userLogin,
    userLogout,
};