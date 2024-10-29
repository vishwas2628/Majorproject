import 'dotenv/config';

import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
const app = express();
import path from "path";
import methodOverride from 'method-override';
import ejsmate from 'ejs-mate';
import {ExpressError} from './utils/ExpressError.js';
import session, { Cookie } from 'express-session';
import MongoStore from 'connect-mongo';
import {listings} from './routes/listing.js';
import {reviews} from './routes/review.js';
import {users} from './routes/user.js';
import flash from 'connect-flash';
import passport from "passport";
import LocalStrategy from "passport-local";
import {User} from './models/user.js';

const DB_URL =process.env.ATLAS_DB;
main().then((res) =>{
    console.log("connected successfully");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(DB_URL);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname , "/public")));


const store = MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE" ,err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, // after 7 days
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

// root route 
// app.get("/", (req,res)=>{
//     res.send("hi im groot");
// });


app.use(session(sessionOptions));//session
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page Not FOund"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500 ,message = "Some Thing went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

app.listen("8080" ,()=>{
    console.log(" Server is listning now to port 8080");
});

// import {Listing} from './models/listing.js'; 
// import {wrapAsync} from './utils/wrapAsync.js';
// import {listingSchema ,reviewSchema} from './schema.js';
// import { Review } from "./models/review.js";
// app.get("/testListing",async  (req,res)=>{
//     let sampleListing = new Listing ({
//         tittle:"Gudgaw",
//         description : "by the beach",
//         price: 1200,
//         location: "Calangute goa",
//         country:"india",
//     });
//     await sampleListing.save();
//     res.send("successfull testing");
// })