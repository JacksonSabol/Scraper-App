// Import 'request' to make HTTP calls
var request = require("request");
// Import "cheerio" to parse markup (HTML in this case) and provide an API for traversing/manipulating the resulting data 
var cheerio = require("cheerio");
// Require all models
var db = require("../models");

// Export all routes for use in the server.js file
module.exports = function (app) {
    // Root route GET request for scraping data from TorrentFreak.com that then renders the results to a Handlebars template
    app.get("/scrape", function (req, res) {
        // Assign a variable to point to an empty array to push results to
        var resultsArray = [];
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
                // Push each result object to the resultsArray after passing Database valdations
                resultsArray.push(result);
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
            // Send the resultsArray back to the client for testing - Send to Handlebars template when set up
            // res.render("index", hbsObject);
            res.send(resultsArray);
        });
    });
}