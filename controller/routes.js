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
	//GET SCRAPED ARTICLES
	app.get("/scrape", (req, res) => {
		axios.get("https://www.cbc.ca/news/canada",
			{ maxContentLength: 50 * 1000 * 1000 }
		)
			.then((response) => {
				console.log(response.data)
				var $ = cheerio.load(response.data);
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
			})
	})

	//GET ARTICLES FROM DB
	app.get("/", (req, res) => {
		db.Article.find().sort({ _id: -1 }).limit(6)
			.exec((err, doc) => {
				if (err) {
					console.log(err);
				} else {
					var article = { article: doc }
					res.render('index', article)
				}
			});
	});

	//GET SAVED ARTICLES
	app.get("/saved", (req, res) => {
		db.Article.find({ saved: true }, (error, result) => {
			console.log(result)
			if (error) {
				console.log("Error in getting saved articles: " + error);
			}
			else {
				res.render("saved", {
					article: result,
				});
			}
		}).sort({ _id: -1 })
	})

	//PUT STATUS FROM FALSE TO TRUE
	app.put("/savedarticles/:id", function (req, res) {
		db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true })
			.then(function (result) {
				console.log("this savedarticle is working");
				res.json(result);
			})
			.catch(function (err) {
				res.json(err);
				console.log("Error in finding saved articles: " + err);
			});
	});

	//DELETE ARTICLE
	app.delete("/deletearticles/:id", function (req, res) {
		db.Article.findOneAndRemove({ _id: req.params.id })
		  .then(function (result) {
			console.log("this article has been deleted");
			res.json(result);
		  })
		  .catch(function (err) {
			res.json(err);
			console.log("Error in finding saved articles: " + err);
		  });
	  });

//NOTES
//=================================================
	//POST COMMENT
	app.post("/articles/:id", function (req, res) {
		db.Comment.create(req.body)
			.then(function (dbComment) {
				return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
			})
			.then(function (dbArticle) {
				res.json(dbArticle);
			})
			.catch(function (err) {
				res.json(err);
			});
	});

	//GET ARTICLES AND POPULATE WITH COMMENT
	app.get("/articles/:id", function (req, res) {
		db.Article.findOne({ _id: req.params.id })
			.populate("note")
			.then(function (dbArticle) {
				res.json(dbArticle);
			})
			.catch(function (err) {
				res.json(err);
			});
	});
}
