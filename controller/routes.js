//**************************************************
//             SCRAPPER AND SCRAPPER ROUTE
//**************************************************/
//Require
//=================================================
//Require node modules
const cheerio = require("cheerio")
const axios = require("axios")

// Require all models
const db = require("../models");

//Scraper
//=================================================
module.exports = (app) => {
	//GET SCRAPED ARTICLES
	app.get("/scrape", (req, res) => {
		axios.get("https://www.cbc.ca/news")
			.then((response) => {
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
					db.Article.create(results)
						.then((dbArticle) => res.json(dbArticle))
						.catch((err) => res.json(err))
				})
				res.redirect("/articles")
			})
	})

	//GET Home
	app.get('/', (req,res) => res.render("scrape"))

	//GET ARTICLES FROM DB
	app.get("/articles", (req, res) => {
		db.Article.find().sort({ _id: -1 }).limit(6)
			.exec((err, doc) => {
				if (err) {
					res.json(err)
				} 
				else {
					let article = { article: doc }
					res.render('index', article)
				}
			})
	});

	//GET SAVED ARTICLES
	app.get("/saved", (req, res) => {
		db.Article.find({ saved: true }, (error, result) => {
			if (error) {
				res.json(err)
			}
			else {
				res.render("saved", {
					article: result,
				});
			}
		}).sort({ _id: -1 })
	})

	//PUT STATUS FROM FALSE TO TRUE
	app.put("/savedarticles/:id", (req, res) => {
		db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true })
			.then((dbArticle) => res.json(dbArticle))
			.catch((err) => res.json(err))
	});

	//DELETE ARTICLE
	app.delete("/delete/:id",(req, res) => {
		db.Article.findOneAndRemove({ _id: req.params.id })
			.then((dbArticle) => res.json(dbArticle))
			.catch((err) => res.json(err))
	  });

	//CLEAR ALL
	app.delete("/clear", (req, res) => {
		db.Article.deleteMany({})
			.then((dbArticle) => res.json(dbArticle))
			.catch((err) => res.json(err))
	  })

//NOTES
//=================================================
	//GET ARTICLES AND POPULATE WITH COMMENT
	app.get("/articles/:id", (req, res) => {
		db.Article.findOne({ _id: req.params.id })
			.populate("comment")
			.then((dbArticle) => res.json(dbArticle))
			.catch((err) => res.json(err))
		})	

	//POST COMMENT
	app.post("/articles/:id", (req, res) => {
		db.Comment.create(req.body)
			.then((dbComment) => {
				return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
			})
			.then((dbArticle) => res.json(dbArticle))
			.catch((err) => res.json(err))
	})
}
