const mongoose = require("mongoose");

function db() {
  // Databse URL
  const url =
    "mongodb+srv://admin:Admin%40123@users.rzo0j.mongodb.net/Users?retryWrites=true&w=majority";

  // Connecting to Database
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database......HURRAAAAYY!!!");
    })
    .catch((err) => {
      console.log(
        "Oh No!!!! Could not connect to the database. Exiting now... ",
        err
      );
      process.exit();
    });
}

module.exports = db;
