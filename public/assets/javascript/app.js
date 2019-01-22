$(document).ready(function () {
    // Hide the notes section when the page loads
    $(".note-section").hide();
    // Show and populate the notes section with new Note submission form when the view-notes button is clicked
    $(".view-notes").on("click", function (event) {
        // Prevent default action
        event.preventDefault();
        // Isolate the article _id from the data-id of the button clicked
        var articleID = $(this).data("id");
        // Assign a variable to hold the div id concatenated with the unique article _id
        var toggleID = "#note-toggle" + $(this).data("id");
        // Use slideToggle to animate the note form - http://api.jquery.com/slidetoggle/
        $(toggleID).slideToggle();
        // Pass the articleID and thisBtn to the getNotes function
        getNotes(articleID);
    });
    // POST a new Note when a post-note button is clicked
    $(".post-note").on("click", function (event) {
        // Prevent default action
        event.preventDefault();
        // Assign variables to hold the unique article _id from the input fields and concatenate with the #id of each input field
        // These values are coded into the input tags in the handlebars template
        var inputName = "#name-input" + $(this).data("id");
        var inputTitle = "#title-input" + $(this).data("id");
        var inputNote = "#note-input" + $(this).data("id");
        // Isolate the article _id from the data-id as well for the Ajax call
        var articleID = $(this).data("id");
        // Check to make sure the Title and Note content are not blank - not concerned with name if user wants to remain anonymous
        if ($(inputTitle).val() != "" && $(inputNote).val() != "") {
            // If they're not empty, make a POST request passing the Note content
            $.ajax({
                method: "POST",
                url: "/articles/" + articleID,
                data: {
                    // Value taken from name-input
                    name: $(inputName).val(),
                    // Value taken from title-input
                    title: $(inputTitle).val(),
                    // Value taken from note-input
                    body: $(inputNote).val()
                }
            }).then(function (data) {
                // Pass the article _id and thisBtn to the getNotes function
                getNotes(articleID, thisBtn);
            });
        }
        // Empty the input fields once the Note has been saved
        $(inputName).val("");
        $(inputTitle).val("");
        $(inputNote).val("");
    });
    // DELETE a note when a remove-note button is clicked
    // $(".remove-note").on("click", function (event) { // For some reason this does not work; had to switch to other method
    $(document).on('click', '.remove-note', function (event) {
        // Prevent default action
        event.preventDefault();
        // Assign a variable to hold the data-id of the note in question
        var noteID = $(this).data("id");
        // Assign a variable to point to the attributes of the button clicked - testing
        var thisBtn = $(this);
        $.ajax({
            method: "DELETE",
            url: "/notes/delete/" + noteID,
        }).then(function (data) {
            // Log for testing - should be same as query which is info about deleted note
            console.log(data); // Uncomment back in once sending data
            console.log("Remove button: ", thisBtn);
            // Log what's above thisBtn
            console.log("Remove button parent: ", thisBtn.parent());
        });
    });
    // Function to get any Notes for an Article
    var getNotes = function (articleID) {
        // Assign a variable to hold the existing-notes span id concatenated with the unique Article _id
        var spanID = "#existing-notes" + articleID;
        // Empty to Article-specific span before re-populating it after the Ajax call - prevent duplicate notes appended to span
        $(spanID).empty();
        // Make an Ajax call to GET any Notes associated with the Article passed to the function
        $.ajax({
            method: "GET",
            url: "/articles/" + articleID
        }).then(function (data) {
            // Assign a variable to hold the Notes associated with the Article
            var notes = data.notes;
            // If there are existing Notes, display them along with a 'remove note' button
            if (notes) {
                // Iterate through all of the populated Notes
                for (var i = 0; i < notes.length; i++) {
                    // Assign a variable to dynamically generate a div tag to hold the content of an entire Note and add class for styling
                    var $notes = $("<div>").addClass("note-content");
                    // Assign a variable to dynamically generate a div tag to hold the name associated with a Note
                    var $name = $("<div>");
                    // Assign a variable to dynamically generate a div tag to hold the title associated with a Note
                    var $title = $("<div>");
                    // Assign a variable to dynamically generate a div tag to hold the note content
                    var $noteBody = $("<div>");
                    // Append the name associated with each Note to the $name div and add a class for styling
                    $name.append("Author: " + notes[i].name).addClass("note-name");
                    // Append the title associated with each Note to the $title div and add a class for styling
                    $title.append("Title: " + notes[i].title).addClass("note-title");
                    // Append the Note content associated with each Note to the $noteBody div and add a class for styling
                    $noteBody.append("Note: " + notes[i].body).addClass("note-text");
                    // Assign a variable to dynamically generate a 'remove note' button with a class for styling
                    var $removeButton = $("<button type='button'>").addClass("btn remove-note");;
                    // Assign a variable to dynamically generate a span to hold a trash-can Glyphicon icon
                    var $removeSpan = $("<span>").addClass("glyphicon glyphicon-trash");
                    // Add a data-id to the removeButton equal to the note _id
                    $removeButton.attr("data-id", notes[i]._id);
                    // Append the Glyphicon span to the removeButton
                    $removeButton.append($removeSpan);
                    // Append the removeButton to the name div
                    $name.append($removeButton);
                    // Append the $name associated with each note to the $notes div
                    $notes.append($name);
                    // Append the $title associated with each note to the $notes div
                    $notes.append($title);
                    // Append the $noteBody to the entire Note div
                    $notes.append($noteBody);
                    // Append the entire Note to the Article-specific existing-notes span - Line 
                    $(spanID).append($notes);
                }
            }
        });
    }
});