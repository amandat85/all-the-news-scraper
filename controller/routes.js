//**************************************************
//             SCRAPPER AND SCRAPPER ROUTE
//**************************************************/
//Require
//=================================================
//Require node modules
const cheerio = require("cheerio")
//set max content length 50mbs
const axios = require("axios")

// Require all models
const db = require("../models");

//Scraper
//=================================================
module.exports = (app) => {
	app.get("/", (req, res) => {
		res.redirect("/articles");
	});

	//GET Route for scraped articles
	app.get("/scrape", (req, res) => {
		axios.get("https://www.cbc.ca/news",
			{ maxContentLength: 50 * 1000 * 1000 }
		)
			.then((response) => {
				console.log(response.data)
				// Load the HTML into cheerio
				var $ = cheerio.load(response.data);
				// Save scraped information
				var results = {};
				$("a.card").each((i, element) => {
					//Headline - Title
					results.title = $(element).find($("h3.headline")).text();
					//Article Link
					results.link = $(element).attr("href");
					//Article Summary
					results.summary = $(element).find($("div.description")).text();
					//Article Image
					results.image = $(element).find($("img")).attr("src");
					// //Article Section
					console.log(results)
					db.Article.create(results)
						.then((dbArticle) => {
							console.log(dbArticle)
						})
						.catch((err) => {
							console.log("There is a scrape error: " + err)
							return res.json(err)
						})
				})
				// res.send("Scrape Successful")
				//Scraped articles to show on page load
				res.redirect("/articles")
			})
	})
	//GET - get articles from db
	app.get("/articles", (req, res) => {
		//allows newer articles to be on top
		db.Article.find().sort({ _id: -1 }).limit(9)
			//send to handlebars
			.exec((err, doc) => {
				if (err) {
					console.log(err);
				} else {
					var article = { article: doc };
					res.render('index', article);
				}
			});
	});
	//GET  - articles by id to populate comment
	app.get("/articles/:id", function (req, res) {
		// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
		db.Article.findOne({ _id: req.params.id })
			// ..and populate all of the notes associated with it
			.populate("note")
			.then(function (dbArticle) {
				// If we were able to successfully find an Article with the given id, send it back to the client
				res.json(dbArticle);
			})
			.catch(function (err) {
				// If an error occurred, send it to the client
				res.json(err);
			});
	});

	//GET - get saved articles
	app.get("/saved", (req, res) => {
		//Query: in our database, go to the articles collection, 
		//then "find" every article that is saved (has a saved value of true);
		db.Article.find({ saved: true }, (error, result) => {
			//Log any errors if the server encounters one.
			console.log(result)
			if (error) {
				console.log("Error in getting saved articles: " + error);
			}
			//Otherwise, send the result of this query to the browser.
			else {
				//res.json(result);
				res.render("saved", {
					article: result,
				});
			}
		}).sort({ _id: -1 })
	})
	//GET - Comments
	// app.get("/articles/:id", function (req, res) {
	// 	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	// 	db.Article.findOne({ _id: req.params.id })
	// 		// ..and populate all of the notes associated with it
	// 		.populate("comment")
	// 		.then(function (dbArticle) {
	// 			// If we were able to successfully find an Article with the given id, send it back to the client
	// 			res.json(dbArticle);
	// 		})
	// 		.catch(function (err) {
	// 			// If an error occurred, send it to the client
	// 			res.json(err);
	// 		});
	// });

	//POST - insert new comment
	// app.post("/articles/:id", function (req, res) {
	// 	// Create a new note and pass the req.body to the entry
	// 	db.Comment.create(req.body)
	// 		.then(function (dbComment) {
	// 			// If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
	// 			// { new: true } tells the query that we want it to return the updated User -- it returns the original by default
	// 			// Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
	// 			return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
	// 		})
	// 		.then(function (dbArticle) {
	// 			// If we were able to successfully update an Article, send it back to the client
	// 			res.json(dbArticle);
	// 		})
	// 		.catch(function (err) {
	// 			// If an error occurred, send it to the client
	// 			res.json(err);
	// 		});
	// });
	//PUT - change articles status to save
	app.put("/savedarticles/:id", function (req, res) {
		db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
			.then(function (result) {
				console.log("this savedarticle is working");
				res.json(result);
			})
			.catch(function (err) {
				res.json(err);
				console.log("Error in finding saved articles: " + err);
			});
	});
	//PUT - delete an article from saved by changing its status to saved: false

	//Can add delete note??


//Notes
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	db.Article.findOne({ _id: req.params.id })
	  // ..and populate all of the notes associated with it
	  .populate("note")
	  .then(function(dbArticle) {
		// If we were able to successfully find an Article with the given id, send it back to the client
		res.json(dbArticle);
	  })
	  .catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
	  });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
	// Create a new note and pass the req.body to the entry
	db.Comment.create(req.body)
	  .then(function(dbComment) {
		// If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
		// { new: true } tells the query that we want it to return the updated User -- it returns the original by default
		// Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
		return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
	  })
	  .then(function(dbArticle) {
		// If we were able to successfully update an Article, send it back to the client
		res.json(dbArticle);
	  })
	  .catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
	  });
  });
  
}
