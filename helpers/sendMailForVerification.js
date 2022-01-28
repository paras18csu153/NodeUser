const nodemailer = require("nodemailer");

const Verification = require("../models/verification.model");

const hashString = require("./hashString");

// async..await is not allowed in global scope, must use a wrapper
async function sendMailForVerification(mail) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  var hash = hashString(mail);
  var verificationLink = process.env.SERVER_URL + "verify/" + hash;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻"', // sender address
    to: mail, // list of receivers
    subject: "Verification Mail", // Subject line
    html:
      "<h3>Hi </h3><p>Your Verification link is:</p><a href='" +
      verificationLink +
      "'>" +
      verificationLink +
      "</a><p>and is valid for 24 hours.</p>", // html body
  });

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  var verification = new Verification({
    verificationLink: hash,
  });

  verification = await Verification.create(verification);
}

module.exports = sendMailForVerification;
