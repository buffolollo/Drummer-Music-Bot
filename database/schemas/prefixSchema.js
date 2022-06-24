const { model, Schema } = require("mongoose");

module.exports = model("users", new Schema({
    _id: Number,
    user: String,
    prefix: {
        type: String,
        default: "!"
    }
}))