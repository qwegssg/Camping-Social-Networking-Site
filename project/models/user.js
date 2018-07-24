var mongoose = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

// create schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// take the passportLocalMongoose package and add in some methods that come with the package to User
UserSchema.plugin(passportLocalMongoose);


// export schema model
module.exports = mongoose.model("User", UserSchema);