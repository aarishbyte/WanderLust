require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("./models/listing");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
  accessToken: mapToken,
});

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function updateListings() {
  const listings = await Listing.find({});

  for (let listing of listings) {
    // if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
      let response = await geocodingClient
        .forwardGeocode({
          query: `${listing.location}, ${listing.country}`,
          limit: 1,
        })
        .send();

      console.log(listing.location,listing.country);
      console.log(response.body.features);

      listing.geometry = response.body.features[0].geometry;
      await listing.save();

      console.log(`Updated ${listing.title}`);
    // }
  }

  console.log("All listings updated!");
  mongoose.connection.close();
}

updateListings();