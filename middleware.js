const ExpressError=require('./utils/ExpressError');
const {campgroundSchema,reviewSchema}=require('./schemas');
const Campground = require('./models/campground');
const Review=require('./models/review');

module.exports.isloggedIn=(req,res,next)=>{
    // console.log('REQ.User ... ',req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
    //Defined our joi schema in schemas.js
    
    //validating our schema
    const {error}=campgroundSchema.validate(req.body);
    //In case of error throwing it to prevent further processing
    if(error){
        const message=error.details.map(el=>el.message).join(',');
        throw new ExpressError(message,400);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{

    const {error} = reviewSchema.validate(req.body);
    if(error){
        const message=error.details.map(el=>el.message).join(',');
        throw new ExpressError(message,400);
    }
    else{
        next();
    }
}

module.exports.isAuthorized=async(req,res,next)=>{
    const {id}= req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that !!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthorized=async(req,res,next)=>{
    const {id,reviewId}= req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are do not have permission to do that !!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

