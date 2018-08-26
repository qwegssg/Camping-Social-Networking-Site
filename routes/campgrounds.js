var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
// index.js file inside the directory will automatically be required when directory is required
var middleware = require("../middleware");

// INDEX: show all the campgrounds
router.get("/", function(req, res) {
    // get all the campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            // render the index page with data from DB
            // res.render will automatically look for the corresponding ejs file in the "views" directory
            res.render("./campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

//CREATE: get data from form and add to the DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var newName = req.body.name;
    var newPrice = req.body.price;
    var newImg = req.body.img;
    var newDesc = req.body.description;
    var newAuthor = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: newName, img: newImg, price: newPrice, description: newDesc, author: newAuthor};
    // create a new campground and save to the DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect to the campgrounds page 
            // if the "get" and "post" requests has the same route ("/campgrounds"),
            // the default is to match the "get" request
            res.redirect("/campgrounds");
        }
    });
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("./campgrounds/new");
});

//SHOW: show more info about one campground
// (make sure this request is listed at the bottom)
router.get("/:id", function(req, res) {
    
    // retrive the campgrounds, populate the comments array in campgrounds, then execute.
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            // render the show page with the data from DB using id
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});  
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and destroy the campground
    Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
