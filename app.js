const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); 
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const Campground = require('./models/campground');   //require our model
const Review = require('./models/review');

const campgrounds = require('./routes/campground');    //routes
const reviews = require('./routes/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;     //check error
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));     //the string we use, ?_method=PUT
app.use(express.static(path.join(__dirname, 'public')))     //serve our public directory for static purpose

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  //in a week from now
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {       //middleware for flash
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();     //need next() for middleware
})

app.use('/campgrounds', campgrounds);   //start with /campgrounds and refer to the campgrounds routes
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', function(req, res){ 
    res.render('home');  
});  

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404))       //ExpressError we defined in the utils, use next() to pass it to the next the err handler function
});

app.use((err, req, res, next) => {  //error handler
    const {statusCode = 500 } = err;       //an error in the app
    if(!err.message) err.message =  'Something went wrong!'
    res.status(statusCode).render('error', { err } )      // the error.ejs and pass the err through to the template
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
