const express = require('express');
const router = express.Router({mergeParams : true });
const Campground = require("../models/TrekModel");
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../Schemas');
const { isLoggedIn } = require('../Middleware');

const validateReview =(req,res,next)=>
    {
        const {error} = reviewSchema.validate(req.body);
        if(error)
          {
            const msg = error.details.map((el) => el.message).join(", ");
           throw new ExpressError(msg, 400);
          }else 
          {
            next();
          }
    } 


router.post('/', validateReview, catchAsync(async (req,res)=>
    {
      const campground = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      review.author = req.user._id;
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      req.flash('success','Successfully added review');
      res.redirect(`/campgrounds/${campground._id}`);
    }))
  
  router.delete('/:reviewId', isLoggedIn, catchAsync(async(req,res)=>
  {
       const {id,reviewId} = req.params;
       await Campground.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success','Successfully delete review');
       res.redirect(`/campgrounds/${id}`);
  }));


module.exports = router;