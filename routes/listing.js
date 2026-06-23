const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//Listings all routes

//we are using Router.route
router
 .route("/")
 .get(wrapAsync(listingController.index))  //INDEX route
 .post(
    isLoggedIn,
    upload.single("listing[image]"), 

    validateListing,
    wrapAsync(listingController.createListing) //Create Route
 );


//New Route = Basically Create from Crud Operations

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
 .route("/:id")
 .get(wrapAsync(listingController.showListings))  //SHow Route
 .put( 
     isLoggedIn,
     isOwner,
     upload.single("listing[image]"), 
     validateListing,
     wrapAsync(listingController.updateListing)) //Update Route
 .delete(isLoggedIn, isOwner,  wrapAsync(listingController.destroyListing) //Delete Route
);

//EDIT Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;