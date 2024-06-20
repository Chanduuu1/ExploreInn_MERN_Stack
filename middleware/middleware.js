const Listing = require("../models/listing");
const { listingVSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewVSchema } = require("../schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user); //this user obj is from where isAuthenticated functions checks if user is logged in or not
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // creates redirectUrl var in session obj and assign it the RHS value.
    console.log(req.session.redirectUrl);
    req.flash("error", "you need to be logged in first");
    res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.permissionToChange = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You don't have permission to edit this listing as you arent the owner"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isValidAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You don't have permission to edit this review as you arent the owner"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingVSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewVSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
