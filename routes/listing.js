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

//Category Filter Route
router.get("/category/:category", async (req, res ) => {
    const { category } = req.params;

    let allListings = await Listing.find({ category });

    res.render("listings/index.ejs", { allListings});
})

//Searching route 

 router.get("/search", async (req, res) => {
    let {query} = req.query;

    const allListings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" }},
            { location: { $regex: query, $options: "i" }},
            { country: { $regex: query, $options: "i" }},
            { category: { $regex: query, $options: "i"}}
        ]
    });

    res.render("listings/index.ejs", {allListings});
 })

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