import express from "express";
const router = express.Router({mergeParams:true});
import {wrapAsync} from '../utils/wrapAsync.js';
import {validateReview , isLoggedIn ,isReviewAuthor} from '../middleware.js';
import {reviewController} from '../controller/reviews.js';

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

export const reviews  = router;