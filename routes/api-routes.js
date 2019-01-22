// Import 'request' to make HTTP calls
var request = require("request");
// Import "cheerio" to parse markup (HTML in this case) and provide an API for traversing/manipulating the resulting data 
var cheerio = require("cheerio");
// Require all models
var db = require("../models");

// Export all routes for use in the server.js file
module.exports = function (app) {
    // Root route to render home page
    app.get("/", function (req, res) {
        // Assign a blank object to send to index.handlebars
        var hbsObject = {};
        res.render("index", hbsObject);
    });
    // GET route to render Saved page
    app.get("/articles/saved", function (req, res) {
        // Grab every document in the Articles collection where the value of 'saved' is 'true' - sort by publication date
        db.Article.find({ saved: true }).sort({ pubdatesort: -1 })
            .then(function (dbArticles) {
                // Assign a key on a handlebars object to hold the dbArticles
                var hbsObject = {
                    articles: dbArticles
                };
                // Render the handlebars object to the saved.handlebars template
                res.render("saved", hbsObject);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // Route for getting all TorrentFreak Articles from the database
    app.get("/articles/torrentfreak", function (req, res) {
        // Grab every document in the Articles collection where the source is "Torrent Freak"
        db.Article.find({ source: "Torrent Freak" }).sort({ pubdatesort: -1 })
            .then(function (dbArticles) {
                // Assign a key on a handlebars object to hold the dbArticles
                var hbsObject = {
                    articles: dbArticles
                };
                // Render the handlebars object to the torrentFreak.handlebars template
                res.render("torrentFreak", hbsObject);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // GET route for scraping data from TorrentFreak.com that then renders the results to a Handlebars template
    app.get("/scrape/torrentfreak", function (req, res) {
        // Make a "request" for the "Latest" section of TorrentFreak.com
        request("https://torrentfreak.com/", function (error, response, HTML) {
            // Load the HTML body from "request" into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(HTML);
            // Grab everything with a class of "entry-contents" - all <div> tags for the "Latest" section have this class
            $(".entry-contents").each(function (i, element) {
                // Save an empty result object
                var result = {};
                // Grab the text of every <h1> tag wrapped in every <a> tag and save it as the title key on the 'result' object
                result.title = $(this).find("h1").text();
                // Grab the href of every <a> tag and save it as the link key on the 'result' object
                result.link = "https://torrentfreak.com" + $(this).find("a").attr("href");
                // Grab the text of every <p> tag and save it as the summary key on the 'result' object
                result.summary = $(this).find("p").text();
                // Grab the content of the <div> attribute "style" from every tag with a class of .entry-image
                // Parse from: style=" background-image: url('/images/computerkeyboardfeat-500x210.png') "
                var styleContent = $(this).find($(".entry-image")).attr("style");
                // Split the string styleContent by (" ' ") to isolate the image source - img src at index 1
                var imageRoute = styleContent.split("'");
                // Concatenate the image source with the base URL, then save it as the image key on the result object
                result.image = "https://torrentfreak.com" + imageRoute[1];
                // Assign the source property to "Torrent Freak" as we're scraping from Torrent Freak on this route
                result.source = "Torrent Freak";
                // Isolate the text of the publication date and assign it to the result object
                result.pubdate = $(this).find("time").text();
                // Isolate the value of the publication datetime and assign it to the result object for sorting
                result.pubdatesort = $(this).find("time").attr("datetime");
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
            // Redirect to /articles/torrentfreak GET route to display Articles
            res.redirect("/articles/torrentfreak");
        });
    });
    // POST route for adding a Note to an article
    app.post('/articles/:id', function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id` 
                // and push the new Note's _id to the Articles's `notes` array
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                // If the Article was successfully updated, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // GET route for grabbing a specific Article by id and populating it with it's Notes
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in the db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then(function (dbArticle) {
                // If the Article was successfully found, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // PUT route for adding an Article to the Saved page
    app.put('/articles/:id', function (req, res) {
        // Find the Article to be saved by _id passed in the :id parameter, then set the value of 'saved' to 'true'
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
            .then(function (dbArticle) {
                // If the Article was successfully updated, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // DELETE route for deleting a Note
    app.delete("/notes/delete/:id", function (req, res) {
        // Using the _id passed in the :id parameter, prepare a query that finds the matching one in the db...
        db.Note.findOneAndDelete({ _id: req.params.id })
            .then(function (dbNote) {
                // Return deleted Note object to client
                res.json(dbNote)
            });
    });
}