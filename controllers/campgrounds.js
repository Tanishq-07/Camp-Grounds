const Campground = require('../models/campground');
const {cloudinary} =require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { query } = require('express');
const campground = require('../models/campground');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm=(req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req, res, next) => {

    const geoData=await geoCoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send();
    const camp = await new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images=req.files.map(f=>({url : f.path, filename : f.filename}));
    camp.author=req.user._id;
    await camp.save();
    req.flash('success',`Successfully created the ${camp.title} campground`);
    res.redirect(`/campgrounds/${camp.id}`);

}

module.exports.showCampground=async (req, res, next) => {

    const campground = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });

}

module.exports.renderEditForm=async (req, res) => {
    
    const {id}=req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground=async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const imgs=req.files.map(f=>({url : f.path, filename : f.filename}));
    camp.images.push(...imgs);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull : {images : {filename : {$in : req.body.deleteImages}}}});
    }
    const geoData=await geoCoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send();
    camp.geometry = geoData.body.features[0].geometry;
    console.log(camp);
    await camp.save();
    req.flash('success',`Successfully updated ${camp.title} campground`);
    res.redirect(`/campgrounds/${camp.id}`);
}

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    const camp=await Campground.findByIdAndDelete(id);
    if(!camp){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    req.flash('success',`Successfylly deleted ${camp.title} campground`);
    res.redirect(`/campgrounds`);
}