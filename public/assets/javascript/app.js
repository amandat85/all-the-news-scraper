//Float icon menu
document.addEventListener('DOMContentLoaded', () => {
	let elems = document.querySelectorAll('.fixed-action-btn');
	let instances = M.FloatingActionButton.init(elems, {
		direction: 'left'
	});
});


$(document).ready(function () {
	$('.modal').modal();
});
//AJAX 
//=================================================
//scrape the articles
$("#scrape").on("click", (event) => {
	$.ajax({
		method: "GET",
		url: "/scrape"
	})
		.then((data) => {
			console.log(data);
			location.href = ('/');
		})

});

//Click save icon
//TODO change to ES6 syntax
$("body").on("click", "#saveArticle", function (event) {
	var thisId = $(this).attr("data-id");
	console.log($(this))
	// Run a PUT request to update saved value of article from false to true
	$.ajax({
		method: "PUT",
		url: "/savedarticles/" + thisId,
	})
		// With that done
		.then(function (data) {
			// Log the response
			console.log("success")
			location.reload();
		})
		.catch(function (err) {
			console.log("Error in article app.js not working: " + err);
		});
});

//Redirect to Saved page on
$('#saved').on("click", (event) => {
	location.href = ('/saved');
});

//when someone clicks to view saved articles
// $('#saved').on("click", function (event) {
// location.href=('/saved');
// });

// document.querySelector('#saveArticle').addEventListener('click', function(event){
//   console.log('clicked')
// })

//Save comment// When you click the save-comment button from modal
$("body").on("click", "#saveComment", function (event) {
	// Grab the id associated with the article from the submit button
	// $('#comment-modal').modal('hide');
	console.log(event)
	var thisId = $(this).attr("data-id");
	console.log("comment saved");
	
	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			// Value taken from note textarea
			body: $("#bodyinput").val()
			
		}
	})
		// With that done
		.then(function (data) {
			// Log the response
			console.log(data);
			// Empty the notes section
			$("#commentInput").empty();
		})
		.catch(function (err) {
			console.log("Error in saving comment in app.js not working: " + err);
		});


});
//Get comment