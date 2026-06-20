const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


//for Validate listing for server side

const validateListing = (req, res, next) => {
        let {error}  = listingSchema.validate(req.body);
     
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        }

};




//Listings all routes

//Index Route
router.get("/", wrapAsync( async (req, res) => {
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    }));

//New Route = Basically Create from Crud Operations

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs")

})

//SHOW ROUTE
router.get("/:id", wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });

}));

//CREATE Route
router.post("/", isLoggedIn, validateListing,
    wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body; one method now there an another approach bt making listing a key in new.ejs 
      
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!")
        res.redirect("/listings");
})
   
);

//EDIT Route

router.get("/:id/edit", isLoggedIn, wrapAsync( async (req, res) => {
     let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Update Route

router.put("/:id", 
     isLoggedIn,
     validateListing,
     wrapAsync( async (req, res) => {
     
  
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success", "Listing Updated!")
     res.redirect(`/listings/${id}`);

}));

//DELETE ROUTE

router.delete("/:id", isLoggedIn,  wrapAsync( async (req, res) => {
     let {id} = req.params;
     let deletedListing =  await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "Listing Deleted!")
     res.redirect("/listings");

})
);

module.exports = router;