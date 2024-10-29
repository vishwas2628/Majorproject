import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/wrapAsync.js";
import passport from "passport";
import {saveRedirectUrl} from "../middleware.js";
import { usersController } from "../controller/user.js";

router.route("/signup")
.get(
    usersController
    .renderSignup
)
.post(
    wrapAsync(usersController
       .userSignup)
   );


router.route("/login")
.get(usersController
    .renderLoginForm)
.post(
        saveRedirectUrl,
        passport
        .authenticate
        ("local",{
            failureRedirect:"/login",
            failureFlash:true,
        })
        ,usersController
        .userLogin);

router.get("/logout", usersController
    .userLogout);
 
export const users  = router;