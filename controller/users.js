const User = require("../models/user.js");
module.exports.signUpPgRender = (req, res) => {
  res.render("users/users.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Created, Welcome");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "User already registered!");
    res.redirect("/signup");
  }
};

module.exports.logInPgRender = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
  req.flash("success", "Welcome to ExploreInn!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out successfully");
    res.redirect("/listings");
  });
};
