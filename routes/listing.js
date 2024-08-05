const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");



router.get("/", wrapasync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
});

router.get("/:id", wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);

    res.render("listings/show.ejs", { listing });
}));



router.post("/", isLoggedIn, validateListing, wrapasync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

router.get("/:id/edit", isLoggedIn, isOwner, wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }
    res.render("../views/listings/edit.ejs", { listing });
}));

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapasync(async (req, res) => {
    let { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));
1
router.delete("/:id", isLoggedIn, isOwner, wrapasync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect("/listings");
}));

module.exports = router;