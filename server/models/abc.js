const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const abc = new Schema({
    Name: String
});

module.exports = mongoose.model("abc", abc);