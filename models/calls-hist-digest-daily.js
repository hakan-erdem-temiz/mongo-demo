const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  request: {
    type: Schema.ObjectId,
    ref: "Request"
  },
  offered: Number,
  datetime: String,
  handled: Number,
  answered: Number,
  slanswered: Number,
  abandoned: Number,
  maxwaittime: Number,
  asa: Number,
  aht: Number,
  id: Number
});

module.exports = mongoose.model("CallsHistDigest", schema);
