const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let verificationSchema = new Schema(
  {
    verificationLink: { type: String, reqiured: true },
  },
  { timestamps: true }
);

var Verification = (module.exports = mongoose.model(
  "Verification",
  verificationSchema
));

// Create user
module.exports.create = async (verification) => {
  verification = await verification.save();
  return verification;
};

// Get Verification Links for user
module.exports.getForUser = async (verificationLink) => {
  var verification = await Verification.findOne({
    verificationLink: verificationLink,
  });
  return verification;
};

// Delete Verification Links for user
module.exports.deleteForUser = async (verificationLink) => {
  var verification = await Verification.deleteMany({
    verificationLink: verificationLink,
  });
  return verification;
};

// Delete Invalid Verification Links
module.exports.deleteAllByTime = async (timestamp) => {
  timestamp = timestamp - 86400000;
  var verification = await Verification.deleteMany({
    createdAt: { $lt: timestamp },
  });
  return verification;
};
