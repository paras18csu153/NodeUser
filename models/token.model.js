const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let tokenSchema = new Schema({
  token: { type: String, reqiured: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

var Token = (module.exports = mongoose.model("Token", tokenSchema));

// Create token
module.exports.create = async (token) => {
  token = await token.save();
  return token;
};

// Get token by User Id
module.exports.getByUserId = async (user_id) => {
  token = await Token.findOne({
    user_id: user_id,
  });
  return token;
};

// Get token by Token
module.exports.getByToken = async (tokenName) => {
  token = await Token.findOne({
    token: tokenName,
  });
  return token;
};

// Update Token
module.exports.updateToken = async (token) => {
  token = await Token.findByIdAndUpdate(
    token._id,
    {
      $set: token,
    },
    { new: true }
  );
  return token;
};

// Delete token by Token
module.exports.deleteByToken = async (tokenName) => {
  token = await Token.findOneAndDelete({
    token: tokenName,
  });
  return token;
};
