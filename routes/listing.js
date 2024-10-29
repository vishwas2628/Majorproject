import express from "express";
const router = express.Router();
import {wrapAsync} from '../utils/wrapAsync.js';
import {isLoggedIn , isOwner ,validateListing } from '../middleware.js';
import {listingsController} from '../controller/listing.js';
import multer from 'multer';
import {storage} from '../cloudConfig.js';
const upload = multer({storage});

router.route("/")
 .get(
    wrapAsync(listingsController.index)
  )
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingsController.createListing)
);
// new route
router.get("/new",
    isLoggedIn, listingsController
    .renderListings
);
router.route("/:id")
.get(
    wrapAsync(listingsController
        .showListing)
)
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingsController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.destroyListing)
);

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.editListing)
);

router
export const listings = router;