module.exports = (app) => {
    //route for creating a new comment
 app.post("/notes", function (req, res) {
    // Find all Notes
    db.Note.find({})
      .then(function (dbNote) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  // Route for retrieving all Notes from the db
  app.get("/notes", function (req, res) {
    // Find all Notes
    db.Note.find({})
      .then(function (dbNote) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  //Route for getting/finding all notes in the database associated with a particular headline/article.
  app.get("/notes/:id", function (req, res) {
    if (req.params.id) {
      db.Note.find({
        "article": req.params.id
      })
        .exec(function (error, doc) {
          if (error) {
            console.log(error)
          } else {
            res.send(doc);
          }
        });
    }
  });

  //Delete a note
  app.delete("/notes/:id", function (req, res) {
    // Remember: when searching by an id, the id needs to be passed in
    db.Note.deleteOne({ _id: req.params.id },
      function (err, data) {
        if (err) {
          console.log(err);
        }
        else {
          res.json(data);
        }
      });
  });
}