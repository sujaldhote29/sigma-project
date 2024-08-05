const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");


router.post("/", validateReview, wrapasync(async (req, res) => {

    console.log(req.params.id);

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}));



// Delete review route

router.delete("/:reviewId", wrapasync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))



module.exports = router;
