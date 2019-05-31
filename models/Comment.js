//**************************************************
//                  COMMENT SCHEMA
//**************************************************/

// //Require Mongoose
// const mongoose = require("mongoose")

// //Set up Schema constructor in variable
// const Schema = mongoose.Schema

// //Comment Schema
// //=================================================
// let CommentSchema = new Schema ({
//     //TODO Add later maybe. See if really needed. Most people don't add titles for comments
//     //Title
//     // title: {
//     //     type: String,
//     // },
//     //Link
//     body: {
//         type: String,
//     },
// })

// //Create Model
// //=================================================
// let Comment = mongoose.model("Comment", CommentSchema)

// //Exports
// //=================================================
// module.exports = Comment

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
