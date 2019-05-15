const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const schema = new Schema({
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User"
  // },
  userId: Schema.Types.ObjectId,
  name: String,
  group: Array
});

module.exports = mongoose.model("CalltypeGroup", schema);
