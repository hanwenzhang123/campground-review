const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');


router.get('/', catchAsync(async (req, res) => { 
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });  //grab and render
}));  

router.get('/new', isLoggedIn, (req, res) => { //middleware in another file to check if you logged in
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);  if the root data not contain campground, we throw the error, 400 client error
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;     //show the user as the person who created it
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {     //populate the author of the specific review
            path: 'author'
        }
    }).populate('author');     //populate the field so we can see the review associated to the campground
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res,) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id)
    if (!campground) {   //check if no this campground found
        req.flash('error', 'Can not find this campground.');
        return res.redirect(`/campgrounds/${id}`);
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => { //update the editing
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });      //spread objects
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted review')
    res.redirect('/campgrounds');
}));

module.exports = router;