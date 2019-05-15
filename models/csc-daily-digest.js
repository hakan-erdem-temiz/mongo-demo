const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  identifier: String,
  date: String,
  offered: String
});

module.exports = mongoose.model("cscdailydigest", schema);
