const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema({
    Username: String,
    Password: String,
    Email: String,
    Phonenumber : String,
    Token : String,
    Uuid : String,
    ListFriends:Array,
    FriendsRequest : Array ,
    Req: Array,
    Locked : Number
});

module.exports = mongoose.model("users", users);