const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/TrekModel");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const ObjectID = require('mongoose').Types.ObjectId;

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});

mongoose.connect("mongodb://127.0.0.1:27017/Trek-Venture");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

 const validateSchema = (req,res,next)=>
  {
    const campgroundSchema = Joi.object({
      campgrounds: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
      }).required(),
    });

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(msg, 400);
    }else 
    {
      next();
    }
  }

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds", validateSchema ,
  catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campgrounds);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    if(!ObjectID.isValid(id))
      {
         throw new ExpressError('Invalid ID',400);
      }
    const camp = await Campground.findById(id);
    if (!camp) throw new ExpressError("Product Not Found", 404);
    res.render("campgrounds/show", { camp });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    if(!ObjectID.isValid(id))
      {
          throw new ExpressError('Invalid ID Update',400);
      }
    const camp = await Campground.findById(id);
    if(!camp) throw new ExpressError('Product Not Found',404);
    res.render("campgrounds/edit", { camp });
  })
);

app.put(
  "/campgrounds/:id", validateSchema , 
  catchAsync(async (req, res) => {
    const { id } = req.params;
     const camp = await Campground.findByIdAndUpdate(id, req.body.campgrounds, { new: true });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Something Went Wrong", statusCode = 500 } = err;
  res.status(statusCode).render('campgrounds/error',{message});
});
