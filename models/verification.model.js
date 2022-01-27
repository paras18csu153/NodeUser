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
  try {
    verification = await verification.save();
    return verification;
  } catch (err) {
    return null;
  }
};

// Get Verification Links for user
module.exports.getForUser = async (verificationLink) => {
  try {
    var verification = await Verification.findOne({
      verificationLink: verificationLink,
    });
    return verification;
  } catch (err) {
    return null;
  }
};

// Delete Verification Links for user
module.exports.deleteForUser = async (verificationLink) => {
  try {
    var verification = await Verification.deleteMany({
      verificationLink: verificationLink,
    });
    return verification;
  } catch (err) {
    return null;
  }
};
