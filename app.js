const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});

mongoose.connect("mongodb://127.0.0.1:27017/Trek-Venture");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sessionConfig = {
    secret : 'THISSHOULDBEASECRET!',
    resave : false , 
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session(sessionConfig))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , 'public')));
app.use(methodOverride("_method"));
app.use(flash());

app.use((req,res,next)=>
{
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews' , reviews);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Something Went Wrong", statusCode = 500 } = err;
  res.status(statusCode).render('campgrounds/error',{message});
});
