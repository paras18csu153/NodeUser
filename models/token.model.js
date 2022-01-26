const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let tokenSchema = new Schema({
  token: { type: String, reqiured: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

var Token = (module.exports = mongoose.model("Token", tokenSchema));

// Create token
module.exports.create = async (token) => {
  try {
    token = await token.save();
    return token;
  } catch (err) {
    return null;
  }
};

// Get token by User Id
module.exports.getByUserId = async (user_id) => {
  try {
    token = await Token.findOne({
      user_id: user_id,
    });
    return token;
  } catch (err) {
    return null;
  }
};

// Get token by Token
module.exports.getByToken = async (tokenName) => {
  try {
    token = await Token.findOne({
      token: tokenName,
    });
    return token;
  } catch (err) {
    return null;
  }
};

// Update Token
module.exports.updateToken = async (token) => {
  try {
    token = await Token.findByIdAndUpdate(
      token._id,
      {
        $set: token,
      },
      { new: true }
    );
    return token;
  } catch (err) {
    return null;
  }
};

// Delete token by Token
module.exports.deleteByToken = async (tokenName) => {
  try {
    token = await Token.findOneAndDelete({
      token: tokenName,
    });
    return token;
  } catch (err) {
    return null;
  }
};
