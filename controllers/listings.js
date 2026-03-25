const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  if (!req.file) {
    req.flash("error", "Image is required!");
    return res.redirect("/listings/new");
  }
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {
    url: req.file.path,
    filename: req.file.filename
  };
  
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originlListingUrl = listing.image.url;
  originlListingUrl = originlListingUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originlListingUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  
  console.log("Received Listing for update:", req.body.listing);
  
  // Find existing listing
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  
  // Update text fields from form
  if (req.body.listing) {
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;
  }
  
  // Only update image if a new one was uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  // If no new file, keep existing image (don't modify listing.image)
  
  await listing.save();
  
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};


