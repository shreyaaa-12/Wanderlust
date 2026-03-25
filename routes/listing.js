const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// TEMPORARY TEST ROUTE
router.get("/", async (req, res) => {
    try {
        console.log("Listings index route hit!");
        const allListings = await Listing.find({});
        console.log(`Found ${allListings.length} listings`);
        res.render("listings/index", { allListings });
    } catch(err) {
        console.error("Error in listings index:", err);
        res.send(`Error: ${err.message}`);
    }
});

// Process uploaded image - ONLY if file exists
const processImage = (req, res, next) => {
  if (req.file) {
    req.body.listing = req.body.listing || {};
    req.body.listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  next();
};

// Index and Create
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    processImage,
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, Delete
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    processImage,
    // DON'T validate here - let controller handle it
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// Edit listing form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;