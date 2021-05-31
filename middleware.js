module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    } 
    next();
}
// you must be signed in in order to do something, otherwise redirect you to the login page