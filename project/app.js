var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    // "./" refer to the current directory
    Campground      = require("./models/campground"), 
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

// require routes
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");
    
// mongoose.connect("mongodb://localhost/yelp_camp");
// connect mongoDB from mLab.com
mongoose.connect("mongodb://admin:admin1@ds147451.mlab.com:47451/yeeeelpcamp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// __dirname will always refer to the current directory
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();    // no longer seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is a Secret!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// User.authenticate comes from passportLocalMongoose package.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware that is called in every single route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// use all the separate routes
// define the prefix("/xxxxxx") that will be added to every route
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("The Yelp Camp server has started!");
});