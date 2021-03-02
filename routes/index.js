var express = require('express');
var router = express.Router();
var StudentUser = require('../models/studentUser');
var passport = require('passport');

router.get('/', function (req, res) {
    res.render('landing');
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', function (req, res) {
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.email === 'e7cs098@sairamtap.edu.in' && obj.password ==='vijayabdul')
    res.render('select');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function(req,res){
    const obj = JSON.parse(JSON.stringify(req.body));
    if(obj.category === 'Alumni'){
        res.redirect('/alumniSignUp');
    }
    if(obj.category === 'Student'){
        res.redirect('studentSignUp');
    }
    if(obj.category === 'Staff'){
        res.redirect('staffSignUp');
    }
})

router.get('/alumniSignUp', function (req, res) {
    res.render('alumniSignUp');
});

router.get('/studentSignUp', function (req, res) {
    res.render('studentSignUp');
});

router.get('/staffSignUp', function (req, res) {
    res.render('staffSignUp');
});

// register logic
router.post('/studentSignUp', function (req, res) {
    const obj = JSON.parse(JSON.stringify(req.body));
    if (obj.password.length < 8) {
        req.flash("error", "password length must be greater than 6 Characters");
        res.redirect('/studentSignUp');
    }

    if(obj.password !== obj.confirmPassword){
        req.flash("error", "Password mismatch");
        res.redirect('/studentSignUp');
    }
    // else {
    //     newUser = new User({
    //         username: req.body.username.trim(),
    //         firstName: req.body.firstName.trim(),
    //         lastName: req.body.lastName.trim()
    //     });
    //     User.findOne({ email: req.body.email }, function (err, user) {
    //         if (!user) {
    //             newUser.email = req.body.email;
    //             if (req.body.avatar) {
    //                 newUser.avatar = req.body.avatar;
    //             }
    //             if (req.body.adminCode === 'vijayselvan45') {
    //                 newUser.isAdmin = true;
    //             }
    //             async.waterfall([
    //                 function (done) {
    //                     User.register(newUser, req.body.password, function (err, user) {
    //                         if (err) {
    //                             return res.render("register", { error: err.message });
    //                         }
    //                         passport.authenticate('local')(req, res, function () {
    //                             req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
    //                             res.redirect('/area');
    //                             done(err, user);
    //                         })
    //                     })
    //                 },
    //                 function (user, done) {
    //                     var smtpTransport = nodemailer.createTransport({
    //                         service: 'Gmail',
    //                         auth: {
    //                             user: 'vijaiselvanvj@gmail.com',
    //                             pass: process.env.GMAILPW
    //                         }
    //                     });
    //                     var mailOptions = {
    //                         to: user.email,
    //                         from: 'vijaiselvanvj@mail.com',
    //                         subject: 'WELCOME TO CHENNAI TOURISM PAGE',
    //                         text: 'Hello,\n\n' +
    //                             'Thankyou ' + user.username + ' for signing in\n\n' + 'You are ready to view Beautiful places in chennai by clicking this link ' + 'http://' + req.headers.host
    //                     };
    //                     smtpTransport.sendMail(mailOptions, function (err) {
    //                         done(err);
    //                     });
    //                 }
    //             ])
    //         }
    //         else if (err || user) {
    //             req.flash("error", "EmailID already exists");
    //             return res.redirect('/register');
    //         }
    //     });
    // }

    newStudentUser = new StudentUser({
        username: obj.username.trim(),
        Name: obj.name.trim(),
        EmailId: obj.email.trim(),
        StudentId: obj.studentId.trim(),
        Year: obj.year.trim(),
        Department: obj.dept.trim(),
        PhoneNo: obj.phoneno.trim(),
    });

    StudentUser.register(newStudentUser, obj.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect('/studentSignUp');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash("success", "Successfully registered as " + newStudentUser.username);
            res.redirect('/login');
        })
    })
    // ===================
})

module.exports = router;
