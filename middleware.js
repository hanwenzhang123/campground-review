module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;     //store the url they are requesting! you can put whatever you want to after the session
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    } 
    next();
}
// you must be signed in in order to do something, otherwise redirect you to the login page