const Listing = require("../models/listing");



//now index route is not just a route its a proper function
module.exports.index =  async (req, res) => {
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    }

//same is for new route its now a function
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}


//same for the show function 
module.exports.showListings =  async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path: "author",}, }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });

};

// same for the create function
module.exports.createListing = async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body; one method now there an another approach bt making listing a key in new.ejs 
      
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!")
        res.redirect("/listings");
}

//same for the edit route -> edit function
module.exports.renderEditForm = async (req, res) => {
     let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

//same for the UPDATE route
module.exports.updateListing = async (req, res) => {
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success", "Listing Updated!")
     res.redirect(`/listings/${id}`);
}

//delete function or destroy function
module.exports.destroyListing = async (req, res) => {
     let {id} = req.params;
     let deletedListing =  await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "Listing Deleted!")
     res.redirect("/listings");

};