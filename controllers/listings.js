const Listing = require("../models/listings");
const mapToken = process.env.MAP_TOKEN;
const Fuse = require("fuse.js");

async function forwardGeocode(address) {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${mapToken}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.features && data.features.length > 0) {
    let coordinates = data.features[0].geometry.coordinates;
    return coordinates; // [lng, lat]
  }
  return null;
}

//index rotr
module.exports.index = async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
};

//get new form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//post create new listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
             path: "author",
            }})
        .populate("owner");
    if(!listing) {          
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
        const { listing } = req.body;

        const coordinates = await forwardGeocode(req.body.listing.location);
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename};
        if(coordinates) {
            newListing.geometry ={ 
            type: "point",
           coordinates: coordinates
            };
        } else {
            newListing.geometry ={ 
            type: "point",
           coordinates: [0,0]
            };
        }
        
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {          
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalUrl = listing.image.url;
   originalUrl = originalUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalUrl});
};

module.exports.updateListing = async (req, res) => {
    let {id } = req.params;
    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data For Listing.");
    }
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};

        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchListings = async (req, res) => {
    const query = req.query.q?.trim() || "";

    const listings = await Listing.find({});
     if(!query) {
        return res.redirect("/listings");
    }
    const options = {
        keys: ['title', 'location', 'price'],
        threshold: 0.4,
    };

    const fuse = new Fuse(listings, options);
    const result = fuse.search(query);
    const filteredListings = result.map(r => r.item);
    if(filteredListings.length === 0) {
        req.flash("error", `No listings found 😢 for ${query}`);
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings: filteredListings, query});
};