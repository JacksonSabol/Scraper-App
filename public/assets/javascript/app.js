$(document).ready(function () {
    // Hide the notes section when the page loads
    $(".note-section").hide();
    // Show and populate the notes section with new Note submission form when the view-notes button is clicked
    $(".view-notes").on("click", function (event) {
        // Prevent default action
        event.preventDefault();
        // Isolate the article _id from the data-id of the button clicked
        var articleID = $(this).data("id");
        // Use slideToggle to animate the note form - http://api.jquery.com/slidetoggle/
        $(".note-section").slideToggle();
        // Pass the articleID to the getNotes function
        getNotes(articleID);
    });
    // POST a new Note when the post-note button is clicked
    $(".post-note").on("click", function () {
        // Prevent default action
        event.preventDefault();

        // Edge case in the future
        // Isolate this button to pass to getNotes function
        // var thisBtn = $(this);

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
                // Pass the article _id to the getNotes function
                getNotes(articleID);
            });
        }
        // Empty the input fields once the Note has been saved
        $(inputName).val("");
        $(inputTitle).val("");
        $(inputNote).val("");
    });
    // Function to get any Notes for an Article
    function getNotes(articleID) {
        // Make an Ajax call to GET any Notes associated with the Article passed to the function
        $.ajax({
            method: "GET",
            url: "/articles/" + articleID
        }).then(function (data) {

            // Edge case in the future
            // // Assign a variable to receive content depending on which button was clicked
            // var notesDiv = "";
            // // If the view-notes button is clicked...
            // if (thisButton.hasClass("view-notes")) {
            //     // Assign notesDiv to the span with a class of existing-notes - https://api.jquery.com/eq/
            //     notesDiv = thisButton.parents().eq(0).find(".existing-notes");
            // }
            // // Otherwise, if the post-note button is clicked...
            // else if (thisButton.hasClass("post-note")) {
            //     // Assign notesDiv to the the span with a class of existing-notes
            //     notesDiv = thisButton.parents().eq(0).find(".existing-notes");

            // }
            // // Otherwise, prevent displaying articles unrelated to a button on the page
            // else {
            //     console.log("Error: unknown button");
            // }
            // console.log("notesDiv test: ", notesDiv);

            // Log for testing
            console.log("Notes Data Returned: ", data.notes);
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
                    $name.append("Note Author: " + notes[i].name).addClass("note-name");
                    // Append the title associated with each Note to the $title div and add a class for styling
                    $title.append(notes[i].title + ": ").addClass("note-title");
                    // Append the Note content associated with each Note to the $noteBody div and add a class for styling
                    $noteBody.append(notes[i].body).addClass("note-text");
                    // Append the $name associated with each note to the $notes div
                    $notes.append($name);
                    // Append the $title associated with each note to the $notes div
                    $notes.append($title);
                    // Assign a variable to dynamically generate a 'remove note' button with a class for styling
                    var $removeButton = $("<button>").addClass("remove-note");;
                    // Assign a variable to dynamically generate a span to hold a trash-can Glyphicon icon
                    var $removeSpan = $("<span>").addClass("glyphicon glyphicon-trash");
                    // Add a data-id to the removeButton equal to the note _id
                    $removeButton.attr("data-id", notes[i]._id);
                    // Append the Glyphicon span to the removeButton
                    $removeButton.append($removeSpan);
                    // Append the removeButton to the $noteBody
                    $noteBody.append($removeButton);
                    // Append the $noteBody to the entire Note div
                    $notes.append($noteBody);
                    // Append the entire Note to the existing-notes span
                    $(".existing-notes").append($notes);
                }
            }
        });
    }
});