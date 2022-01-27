const schedule = require("node-schedule");
const ForgetPassword = require("../models/forgetPassword.model");
const Verification = require("../models/verification.model");

function scheduler() {
  const job = schedule.scheduleJob("30 2 * * *", function () {
    var currentTimestamp = Date.now();
    Verification.deleteAllByTime(currentTimestamp);
    ForgetPassword.deleteAllByTime(currentTimestamp);
  });
}

module.exports = scheduler;
