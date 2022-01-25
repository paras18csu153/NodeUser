function checkPassword(str) {
  var exp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return exp.test(str);
}

module.exports = checkPassword;
