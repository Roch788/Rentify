const User = require("../models/user")
const ExpressError = require("../utils/customError.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to WanderLust! You are Logged In");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}
module.exports.login = (async (req, res) => {
    req.flash("success", "Welcome to wanderLust!:You are LoggedIn")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
})

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "LoggedOut successfully")
        res.redirect("/listings");
    })
}