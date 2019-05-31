
//scrape the articles
$("#scrape").on("click", function (event) {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (data) {
      console.log(data);
      location.href = ('/');
    })

});

// //whenever someone clicks on save article button
$("body").on("click", "#saveArticle", function (event) {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("article saved with this id: " + thisId);
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


$('#saved').on("click", function (event) {
  location.href=('/saved');
});

//when someone clicks to view saved articles
// $('#saved').on("click", function (event) {
// location.href=('/saved');
// });

// document.querySelector('#saveArticle').addEventListener('click', function(event){
//   console.log('clicked')
// })