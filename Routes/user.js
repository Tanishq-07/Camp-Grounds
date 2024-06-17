const express=require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/CatchAsync');
const passport=require('passport');
const {storeReturnTo} = require('../middleware');
const userControllers=require('../controllers/users');

router.route('/register')
    .get(userControllers.renderRegister)
    .post(catchAsync(userControllers.register))

router.route('/login')
    .get(userControllers.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect : '/login'}),userControllers.login)

router.get('/logout',userControllers.logout)

module.exports = router;
