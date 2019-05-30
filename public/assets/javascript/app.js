$("#scrape").on("click", function (event) {
	$.ajax({
		method: "GET",
		url: "/scrape"
	})
	.then(function(data) {
		console.log(data)
		location.href = ("/")
	})
})