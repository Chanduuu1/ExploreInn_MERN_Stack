const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsyn.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isValidAuthor,
} = require("../middleware/middleware.js");

const { saveTheReview, destroyReview } = require("../controller/review.js");

//reviews post route
router.post("/", validateReview, wrapAsync(saveTheReview));

router.delete("/:reviewId", isValidAuthor, wrapAsync(destroyReview));

module.exports = router;
