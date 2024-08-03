const express = require("express");
const router = express.Router();
const Campground = require("../models/TrekModel");
const catchAsync = require("../utils/catchAsync");
const ObjectID = require("mongoose").Types.ObjectId;
const {isLoggedIn , isAuthor , validateSchema} = require('../Middleware');

router.get(
  "/" ,
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new" ,isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",isLoggedIn,
  validateSchema,
  catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campgrounds);
    camp.author = req.user._id; 
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
    const camp = await Campground.findById(id).populate(
    {
      path : 'reviews' ,
      populate : {
         path : 'author'
      }
    }).populate("author");
    if(!camp)
      {
         req.flash('error','Can not find that campground');
         return res.redirect('/campgrounds');
      }
    res.render("campgrounds/show", { camp });
  })
);

router.get(
  "/:id/edit",isLoggedIn, isAuthor ,
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
  "/:id", isLoggedIn , isAuthor,
  validateSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campgrounds, {
      new: true,
    });
    req.flash('success','Successfully update campground');
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id", isLoggedIn , isAuthor , 
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully delete campground');
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
