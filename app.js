var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    StudentUser = require('./models/studentUser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash');

app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost/alumni', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

var indexRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(flash());

//PASSPORT configuration
app.use(require('express-session')({
    secret: 'session',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(StudentUser.authenticate()));
passport.serializeUser(StudentUser.serializeUser());
passport.deserializeUser(StudentUser.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);

var port = 3000;
app.listen(port, function () {
    console.log('Alumni sever has started');
});
