const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find(); // returns array of the listing objects.
  res.render("listings/index.ejs", { allListings });
};

module.exports.LNewFormRender = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.LEditFormRender = async (req, res) => {
  let { id } = req.params;
  const listingDetail = await Listing.findById(id);
  console.log(listingDetail);

  let originalImageUrl = listingDetail.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  console.log("originalImageUrl" + originalImageUrl);

  res.render("listings/edit.ejs", { listingDetail, originalImageUrl });
};

module.exports.showTheListing = async (req, res) => {
  let { id } = req.params;
  const listingD = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listingD) {
    req.flash("error", "The listing you are trying to access was deleted");
    res.redirect("/listings");
  }
  console.log(listingD);
  res.render("listings/particularListing.ejs", { listingD });
};

module.exports.saveNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  console.log(newListing.geometry);
  req.flash("success", "New listing added Successfully");
  res.redirect("/listings");
};

module.exports.updateCurrListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing was updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing was deleted successfully!");
  return res.redirect("/listings");
};
