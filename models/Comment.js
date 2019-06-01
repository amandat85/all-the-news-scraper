//**************************************************
//                  COMMENT SCHEMA
//**************************************************/

//Require Mongoose
const mongoose = require("mongoose")

//Set up Schema constructor in variable
const Schema = mongoose.Schema

//Comment Schema
//=================================================
let CommentSchema = new Schema ({
    //TODO Add later maybe. See if really needed. Most people don't add titles for comments
    body: {
        type: String,
    },
})

//Create Model
//=================================================
let Comment = mongoose.model("Comment", CommentSchema)

//Exports
//=================================================
module.exports = Comment
