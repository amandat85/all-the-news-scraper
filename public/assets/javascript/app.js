//**************************************************
//            JAVASCRIPT FUNCTIONS
//**************************************************/
//FLOAT ICON MENU
document.addEventListener('DOMContentLoaded', () => {
	let elems = document.querySelectorAll('.fixed-action-btn');
	let instances = M.FloatingActionButton.init(elems, {
		direction: 'left'
	});
});

//LOAD MODAL
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
			location.href = ('/scrape');
		})
});

//SAVE ARTICLES
$("body").on("click", ".bookmark", function (event) {
	// alert("article saved")
	let thisId = $(this).attr("data-id");
	$.ajax({
		method: "PUT",
		url: "/savedarticles/" + thisId,
	})
		.then(function (data) {
			console.log("success")
			location.reload();
		})
		.catch(function (err) {
			console.log("Error in article app.js not working: " + err);
		});
});

//SAVE COMMENT
$("body").on("click", ".saveComment", function (event) {
	console.log(event)
	var thisId = $(this).attr("data-id");
	console.log("comment saved");
		$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			body: $(".bodyInput").val()
		}
	})
		.then(function (data) {
			console.log(data);
			// $("#commentInput").val("");
		})
		.catch(function (err) {
			console.log("Error in saving comment in app.js not working: " + err);
		});	
});

//DELETE ARTICLE FROM SAVED
$("body").on("click", ".deleteArticle", function (event) {
	var thisId = $(this).attr("data-id");
	console.log("article saved with this id: " + thisId);
	$.ajax({
	  method: "DELETE",
	  url: "/delete/" + thisId,
	})
	  .then(function (data) {
		console.log("the article with this id: " + thisId + " was deleted from the database");
		location.reload();
	  })
	  .catch(function (err) {
		console.log("Error in article app.js not working: " + err);
	  });
  });

  //CLEAR ALL ARTICLES
  $("body").on("click", ".clearAll", function (event) {
	$.ajax({
	  method: "DELETE",
	  url: "/clear"
	})
	  .then(function (data) {
		console.log("the article with this id: " + thisId + " was deleted from the database");
		location.reload();
	  })
	  .catch(function (err) {
		console.log("Error in article app.js not working: " + err);
	  });
  });