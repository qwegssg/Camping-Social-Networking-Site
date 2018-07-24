var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

// All the middlewares go here
var middlewareObj = {};

// Campground Authorization
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "Campground not found");
                // back to what the user came from the most, i.e., the previous page
                res.redirect("back");
            } else {
                // does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });   
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

// Comment Authorization
middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                // does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });   
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

// login middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;