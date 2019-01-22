// Import mongoose
var mongoose = require("mongoose");
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true // Prevent duplicates
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true

    },
    source: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    pubdate: {
        type: String
    },
    pubdatesort: {
        type: Date
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// This creates the Article model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;