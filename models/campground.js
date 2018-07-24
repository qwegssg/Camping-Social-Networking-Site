// # Refactor Mongoose Code
// * Create a models directory
// * Use module.exports

var mongoose = require("mongoose");

// Setup Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    img: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "the_Comment"
        }    
    ]
});

// module.exports: once campground.js file is required, the model will be returned.

// Mongoose by default produces a collection name by 
// passing the model name to the utils.toCollectionName method. 
// This method pluralizes the name.
module.exports = mongoose.model("Campground", campgroundSchema);