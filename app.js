/* This JavaScript code is setting up a server using Express.js framework. Here's a breakdown of what
the code is doing: */
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const methodOverride = require("method-override");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


// Setting up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For handling JSON payloads
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log("Error connecting to DB:", err);
    });

// Route Handlers
app.get("/", (req, res) => {
    res.send("root is working");
});



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


// 404 Route Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Starting the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
