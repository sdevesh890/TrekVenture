const express = require("express");
const router = express.Router();
const Campground = require("../models/TrekModel");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const ObjectID = require("mongoose").Types.ObjectId;
const { campgroundSchema } = require("../Schemas");

const validateSchema = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateSchema,
  catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campgrounds);
    await camp.save();
    req.flash('success','Successfully created a new Campground');
    res.redirect(`/campgrounds/${camp._id}`);
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      req.flash('error','Invalid ID');
      return res.redirect('/campgrounds');
    }
    const camp = await Campground.findById(id).populate("reviews");
    if(!camp)
      {
         req.flash('error','Can not find that campground');
         return res.redirect('/campgrounds');
      }
    res.render("campgrounds/show", { camp });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      req.flash('error','Invalid ID');
      return res.redirect('/campgrounds');
    }
    const camp = await Campground.findById(id);
    if(!camp)
      {
         req.flash('error','Can not find that campground');
         return res.redirect('/campgrounds');
      }
    res.render("campgrounds/edit", { camp });
  })
);

router.put(
  "/:id",
  validateSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campgrounds, {
      new: true,
    });
    req.flash('success','Successfully update campground');
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully delete campground');
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
