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
//SCRAPE ARTICLES
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

//SAVE ARTICLES
//TODO change to ES6 syntax
$("body").on("click", "#bookmark", function (event) {
	var thisId = $(this).attr("data-id");
	console.log($(this))
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

//SAVED COMMENT
$("body").on("click", "#saveComment", function (event) {
	console.log(event)
	var thisId = $(this).attr("data-id");
	console.log("comment saved");
		$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			body: $("#bodyinput").val()
		}
	})
		.then(function (data) {
			console.log(data);
			$("#commentInput").empty();
		})
		.catch(function (err) {
			console.log("Error in saving comment in app.js not working: " + err);
		});

});
//Get comment