const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');  //take any error
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {       //add another try catch route
        const { email, username, password } = req.body;
        const user = new User({ email, username });     //new object into the variable
        const registeredUser = await User.register(user, password);     //take the entire new instance of the user and store the salted hashed password
        req.login(registeredUser, err => {  //.login() requires an err callback
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);      //error itself contains the message
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {        //serving a form
    res.render('users/login');
})

//passport.authenticate()   give us an middleware, here we use the local strategy but can be used for google, twitter, etc.
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {   
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'; //req.session.returnTo set in the middleware.js which equals to req.originalUrl
    delete req.session.returnTo;       // delete the session.returnTo to prevent future url return to, we delete this object
    res.redirect(redirectUrl);      //redirect to the url stored in session that has previous on or the campgrounds
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
})

module.exports = router;