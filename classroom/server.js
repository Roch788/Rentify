const express = require("express");
const app = express();
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")

let sessionOptions = (
    {
        secret: "mysupersecretstring",
        resave: false,
        saveUninitialized: true,
    }
);
app.use(session(sessionOptions));
app.use(flash())

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))



app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;  //variable banane ka method
    req.flash('success', "user registered")
    res.redirect("/hello")
})
app.get("/hello", (req, res) => {
    res.locals.msgs=req.flash("success")
    res.render("page.ejs",{name:req.session.name})
}) 


app.listen(3000, () => {
    console.log("server listening");
})