const { model, Schema } = require("mongoose");

module.exports = model("drummer-users", new Schema({
    _id: Number,
    prefix: {
        type: String,
        default: "!"
    }
}))