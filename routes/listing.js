const express= require("express");
const router= express.Router();//create new router obj
const wrapAsync = require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middlewares");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload =multer({storage});
//express routers are a way to organize your express apllication such that our primary app.js file does not become bloated

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.creatListing))


//
//search
router.get("/search", wrapAsync(listingController.searchListings));
//filter
router.get("/category",wrapAsync(listingController.indexCategory));

// NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//EDIT
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports=router;