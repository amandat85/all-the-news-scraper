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
