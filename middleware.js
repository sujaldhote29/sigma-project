const Listing = require("./models/listing.js");
const { listingJoiSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/Expresserror.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing")
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    console.log(req.body);
    let { error } = listingJoiSchema.validate(req.body.listing);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    console.log(req.body);
    let { error } = reviewSchema.validate(req.body.listing);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
