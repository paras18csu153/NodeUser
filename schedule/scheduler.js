const schedule = require("node-schedule");
const Verification = require("../models/verification.model");

function scheduler() {
  const job = schedule.scheduleJob("30 2 * * *", function () {
    console.log("The answer to life, the universe, and everything!");
    var currentTimestamp = Date.now();
    Verification.deleteAllByTime(currentTimestamp);
  });
}

module.exports = scheduler;
