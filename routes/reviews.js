const express = require('express');
const router = express.Router({mergeParams : true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controller/reviews');

const { isLoggedIn , validateReview } = require('../Middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.reviewCreate))
  
router.delete('/:reviewId', isLoggedIn, catchAsync(reviews.reviewDelete));


module.exports = router;