const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let ownerSchema = new Schema({
  username: { type: String, reqiured: true },
  email: { type: String, reqiured: true },
  password: { type: String, reqiured: true },
});

module.exports = mongoose.model("User", userSchema);
