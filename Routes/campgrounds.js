const express = require('express');
const router = express.Router({ mergeParams: true });
const CatchAsync = require('../utils/CatchAsync');
const Campground = require('../models/campground');
const { isloggedIn, validateCampground, isAuthorized } = require('../middleware');
const campgroundcontrol = require('../controllers/campgrounds');
const {storage} = require('../cloudinary');
const multer=require('multer');
const upload=multer({storage});

//CAMPGROUND Routes : 

//HOME PAGE : 
// router.get('/', (req, res) => {
//     res.render('home');
// })

//INDEX and create campground: 
router.route('/')
    .get(CatchAsync(campgroundcontrol.index))
    .post(isloggedIn,upload.array('image') ,validateCampground, CatchAsync(campgroundcontrol.createCampground))

//Order must be like this : (or it will treat new as :id)
//Get new campground form : 
router.get('/new', isloggedIn, campgroundcontrol.renderNewForm);

//Show,update,delete a campground : 
router.route('/:id')
    .get(CatchAsync(campgroundcontrol.showCampground))
    .put(isloggedIn, isAuthorized,upload.array('image'),validateCampground, CatchAsync(campgroundcontrol.updateCampground))
    .delete(isloggedIn, isAuthorized, CatchAsync(campgroundcontrol.deleteCampground))

//Get edit campground form : 
router.get('/:id/edit', isloggedIn, isAuthorized, CatchAsync(campgroundcontrol.renderEditForm))


module.exports = router;
