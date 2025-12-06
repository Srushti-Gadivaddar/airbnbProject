const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings");
const {isLoggedIn, isOwner, validateLsting} = require("../middleware.js");
const listingsController = require("../controllers/listings");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

//search Listings route
router.get("/search", (listingsController.searchListings));

//Index and Create routes
router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn, validateLsting,upload.single('listing[image]'), wrapAsync(listingsController.createListing));



//new form route
router.get("/new", isLoggedIn , (listingsController.renderNewForm));

//Show, Update and Delete routes
router.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(isLoggedIn , isOwner,  validateLsting, upload.single('listing[image]'),wrapAsync(listingsController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingsController.deleteListing));


//Edit form route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingsController.editListing));


module.exports = router;