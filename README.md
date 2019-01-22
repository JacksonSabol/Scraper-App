# :page_with_curl: Tech News Scraper :page_with_curl:

## ~ Get More from Your News ~

### The following project is a news collating application that scrapes TorrentFreak.com for the latest in tech news

I employed HTML, CSS, JavaScript, and jQuery on the front-end to make this application. The front-end work is partially served as static pages, but most of the hard work is done by using Handlebars.js templates. News articles are scraped using Request and Cheerio Node.js modules and are stored in a Mongo database using Mongoose and Express.js.

### Using the Application:

* Visit the link to the Heroku deployed application at the bottom of this README, or at the top of the GitHub page

* Click on the TorrentFreak dropdown menu in the Navbar
    * Click on Scrape to scrape for the latest articles - if the scrape is successful, you will be redirected to the latest articles page
    * Click on Display to display the latest articles scraped by the application
    * Note: if there are no more recent articles since the last time a user scraped, you will not be redirected to the latest articles page. If this happens, click on Display from the TorrentFreak dropdown menu.

* Once on the latest articles page, you'll see a headline, an image, a brief description, a save button, and a comment button. 
    * If you want to learn more about the article, feel free to click on the headline to open up the full article on TorrentFreak
    * If you want to leave a public comment about the article, or see what others have to say about it, click on the comments icon
    * If you really like the article, click on the save button to add it to your saved page
    * But if you change your mind, you can always removed it from your saved list by clicking the remove button, and you can always delete your comments but clicking the trash icon

## ![Demo](ScraperAppDemo.png)

 Object-oriented, functional programming allows web developers to minimize the amount of work each file does, making a more efficient application. In this instance, I utilized Mongoose as the object data modeling (ODM) library that works together with models and functions from other files to query a MongoDB database. The creation of new data and rendering it to the DOM is done by separate, but connected files:

 ``` javascript
// POST route for adding a Note to an article in api-routes.js
    app.post('/articles/:id', function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
 ```
 ``` javascript
 // POSTing a new note on the click of a button
$(".post-note").on("click", function (event) {
        event.preventDefault();
        var inputName = "#name-input" + $(this).data("id");
        var inputTitle = "#title-input" + $(this).data("id");
        var inputNote = "#note-input" + $(this).data("id");
        var articleID = $(this).data("id");
        if ($(inputTitle).val() != "" && $(inputNote).val() != "") {
            $.ajax({
                method: "POST",
                url: "/articles/" + articleID,
                data: {
                    name: $(inputName).val(),
                    title: $(inputTitle).val(),
                    body: $(inputNote).val()
                }
            }).then(function (data) {
                getNotes(articleID);
            });
        }
        $(inputName).val("");
        $(inputTitle).val("");
        $(inputNote).val("");
    });
 ```
### Feel free to play around with the application and maybe learn something new along the way!

[Link to my Application](https://news-scraper-js.herokuapp.com/)

Thank you for reading!

### Built With:
* HTML
* CSS
* JavaScript
* jQuery Library
* JSON
* Bootstrap CSS Library
* Bootstrap JavaScript Library
* Node.js
* Express.js
* Handlebars.js
* Cheerio
* Request
* Body Parser
* Morgan
* MongoDB
* Mongoose
* GitHub
* Heroku