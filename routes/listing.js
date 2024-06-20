const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyn.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  permissionToChange,
  validateListing,
} = require("../middleware/middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.saveNewListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.LNewFormRender);

//Show Route //update route //delete listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showTheListing))
  .put(
    isLoggedIn,
    permissionToChange,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateCurrListing)
  )
  .delete(
    isLoggedIn,
    permissionToChange,
    wrapAsync(listingController.destroyListing)
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  permissionToChange,
  wrapAsync(listingController.LEditFormRender)
);
module.exports = router;
