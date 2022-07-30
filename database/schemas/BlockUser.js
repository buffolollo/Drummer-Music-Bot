const { model, Schema } = require("mongoose");

module.exports = model(
  "drummer-blocked-users",
  new Schema({
    _id: Number,
    blocked: {
      type: Boolean,
      default: false,
    },
  })
);
