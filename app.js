if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path")
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override")
const ExpressError = require("./utils/customError.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const session = require("express-session")
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const userRouter = require("./routes/user.js")

// const MongoURL = 'mongodb://127.0.0.1:27017/WanderLust2';
const dbUrl = process.env.ATLASDB_URL;
main().then(() => {
    console.log("Connected to Db")
}).catch(err => {
    console.log("error aagya");
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error",(err)=>{
    console.log("ERROR IN THE MONGO STORE",err);
})
const sessionOptions = ({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //from today's date to the next 7 days(days*hrs*mins*sec*millisecond)
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // cors se bachane ke liye
    }
});
// app.get("/", (req, res) => {
//     res.send("hi");
// })

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/demo", async (req, res) => {
    let fakeUser = new User({
        email: "@gmail1.com",
        username: "delta-studen1111t",
    })
    let registeredUser = await User.register(fakeUser, "helloworld"); //(object,password)
    res.send(registeredUser)
})



//listings route
app.use("/listings", listingRouter);
//Reviews route
app.use("/listings/:id/reviews", reviewRouter);
//user route
app.use("/", userRouter)

// 404 handler (sab routes ke baad)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});



// Error handling middleware (SABSE LAST)
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.render("error.ejs", { message })
    // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("hi server is listening")
})
