const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = Schema(
  {
    _id: Number,
    label: String,
    resource: {
      type: String,
      default: "system"
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    },
    strict: false
  }
);

schema
  .virtual("code")
  .get(function() {
    return this._id;
  })
  .set(function(code) {
    this._id = code;
  });

schema.set("toJSON", {
  transform: function(doc, ret, options) {
    delete ret.__v;
    ret.code = Number(ret._id);
    delete ret._id;
    return ret;
  }
});

let model = mongoose.model("ReasonCode", schema);
module.exports = model;
