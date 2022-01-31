const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let forgetPasswordSchema = new Schema(
  {
    verificationLink: { type: String, reqiured: true },
    email: { type: String, reqiured: true },
  },
  { timestamps: true }
);

var ForgetPassword = (module.exports = mongoose.model(
  "ForgetPassword",
  forgetPasswordSchema
));

// Create user
module.exports.create = async (fp) => {
  fp = await fp.save();
  return fp;
};

// Get Verification Links for user
module.exports.getForUser = async (verificationLink) => {
  var fp = await ForgetPassword.findOne({
    verificationLink: verificationLink,
  });
  return fp;
};

// Delete Verification Links for user
module.exports.deleteForUser = async (verificationLink) => {
  var fp = await ForgetPassword.deleteMany({
    verificationLink: verificationLink,
  });
  return fp;
};

// Delete Invalid Forget Password Links
module.exports.deleteAllByTime = async (timestamp) => {
  timestamp = timestamp - 86400000;
  var fp = await ForgetPassword.deleteMany({
    createdAt: { $lt: timestamp },
  });
  return fp;
};
