const express=require('express');
const router=express.Router({mergeParams : true});
const CatchAsync=require('../utils/CatchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const {isloggedIn , validateReview,isReviewAuthorized} = require('../middleware');
const reviewController=require('../controllers/reviews')

//Review routes : 

//create review
router.post('/',isloggedIn,validateReview,CatchAsync(reviewController.createReview))
    
//Deleting review
router.delete('/:reviewId',isloggedIn,isReviewAuthorized,CatchAsync(reviewController.deleteReview))

module.exports=router;