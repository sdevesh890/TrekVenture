const express = require('express');
const Campground = require("../models/TrekModel");
const Review = require('../models/review');

module.exports.reviewCreate = async (req,res)=>
    {
      const {id} = req.params;
      const campground = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      review.author = req.user._id;
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      req.flash('success','Successfully added review');
      res.redirect(`/campgrounds/${id}`);
    }

    module.exports.reviewDelete = async(req,res)=>
        {
             const {id,reviewId} = req.params;
             await Campground.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
              await Review.findByIdAndDelete(reviewId);
              req.flash('success','Successfully delete review');
             res.redirect(`/campgrounds/${id}`);
        }