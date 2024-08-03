const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { listingJoiSchema } = require("../schema.js");
const ExpressError = require("../utils/Expresserror.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    console.log(req.body);
    let { error } = listingJoiSchema.validate(req.body.listing);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.get("/", wrapasync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

router.get("/:id", wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));



router.post("/", validateListing, wrapasync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

router.get("/:id/edit", wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist");
        res.redirect("/listings");
    }
    res.render("../views/listings/edit.ejs", { listing });
}));

router.put("/:id", validateListing, wrapasync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));
1
router.delete("/:id", wrapasync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect("/listings");
}));

module.exports = router;