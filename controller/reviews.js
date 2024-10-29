import {Listing} from '../models/listing.js';
import { Review } from "../models/review.js";

const createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "New Review Submitted!");
    res.redirect(`/listings/${listing._id}`);
};

const destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review Deleted!");
    res.redirect(`/listings/${id}`);
};

export const reviewController = {
    createReview,
    destroyReview,
}