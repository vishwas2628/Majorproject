import {Listing} from '../models/listing.js';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
const mapToken = process.env.ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 

const index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

const renderListings = (req,res)=>{
    res.render("listings/new.ejs");
}

const showListing =  async(req,res)=>{
    const {id}=req.params;
    const listing =await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path: 'author',
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for dose not exist!");
        return res.redirect("/listings");
    }
    // console.log(listing)
    res.render("listings/show.ejs" ,{listing});
};

const createListing = async(req,res,next)=>{
    // let result = listingSchema.validate(req.body);
    // if (result.error){
    //     throw new ExpressError(400, result.error);
    // }
    // if (!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }
        // const {title, description, image,price,country,lication}= req.body;

    let responce = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          })
            .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename}
    newListing.geometry = responce.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    // console.log(listing);
};

const editListing = async (req , res)=>{
    const {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for dose not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue");
    res.render("listings/edit.ejs" ,{listing ,originalImageUrl});
};

const updateListing =  async(req,res)=>{
    // if (!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    const {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});

    if (typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

const destroyListing = async(req,res)=>{
    const {id}=req.params;
    const deletedList= await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
    // console.log(deletedList);
};
export const listingsController = {
    index,
    renderListings,
    showListing,
    createListing,
    editListing,
    updateListing,
    destroyListing,
};