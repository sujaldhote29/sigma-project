const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const Expresserror = require("./utils/Expresserror.js");
const { listingJoiSchema } = require("./schema.js");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to handle JSON payloads
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("root is working");
});

const validateListing = (req, res, next) => {
    let { error } = listingJoiSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new Expresserror(400, errMsg);
    } else {
        next();
    }
};

app.get("/listings", wrapasync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
}));

app.post("/listings", validateListing, wrapasync(async (req, res, next) => {
    let result = listingJoiSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new Expresserror(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapasync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));

app.put("/listings/:id", validateListing, wrapasync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));

app.all("*", (req, res, next) => {
    next(new Expresserror(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});
