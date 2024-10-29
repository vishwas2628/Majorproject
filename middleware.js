import {Listing} from './models/listing.js'; 
import {ExpressError} from './utils/ExpressError.js';
import {listingSchema , reviewSchema} from './schema.js';
import { Review } from "./models/review.js";

export const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

export const saveRedirectUrl = (req, res,next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

export const isOwner = async (req, res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner f this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

export const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        throw new ExpressError(400, error);
    } else{
        next();
    }
};

export const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        throw new ExpressError(400, error);
    } else{
        next();
    }
};

export const isReviewAuthor = async (req, res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};