var express = require("express");
var router = express.Router();
var StudentUser = require("../models/studentUser");
var AlumniUser = require("../models/alumniUser");
var StaffUser = require("../models/staffUser");
var passport = require("passport");
var middleware = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

router.get("/", function (req, res) {
  res.render("landing");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  // console.log(obj);
  StudentUser.findOne({ username: obj.username }, function (err, user) {
    if (user && user.isStudent === true) {
      passport.authenticate("studentLocal", function (err, user, info) {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!user) {
          req.flash("error", "Invalid Username or password");
          return res.redirect("/login");
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          var redirectTo = req.session.redirectTo
            ? req.session.redirectTo
            : "/select";
          delete req.session.redirectTo;
          req.flash("success", "Welcome back " + req.user.username);
          res.redirect(redirectTo);
        });
      })(req, res, next);
    }
  });
  AlumniUser.findOne({ username: obj.username }, function (err, user) {
    if (user && user.isAlumni === true) {
      passport.authenticate("alumniLocal", function (err, user, info) {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!user) {
          req.flash("error", "Invalid Username or password");
          return res.redirect("/login");
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          var redirectTo = req.session.redirectTo
            ? req.session.redirectTo
            : "/alumniChoice";
          delete req.session.redirectTo;
          req.flash("success", "Welcome back " + req.user.username);
          res.redirect(redirectTo);
        });
      })(req, res, next);
    }
  });
  StaffUser.findOne({ username: obj.username }, function (err, user) {
    if (user && user.isStaff === true) {
      passport.authenticate("staffLocal", function (err, user, info) {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!user) {
          req.flash("error", "Invalid Username or password");
          return res.redirect("/login");
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          var redirectTo = req.session.redirectTo
            ? req.session.redirectTo
            : "/staff";
          delete req.session.redirectTo;
          req.flash("success", "Welcome back " + req.user.username);
          res.redirect(redirectTo);
        });
      })(req, res, next);
    }
  });
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  const obj = JSON.parse(JSON.stringify(req.body));
  if (obj.category === "select") {
    req.flash("error", "Please select the option");
    res.redirect("/register");
  }
  if (obj.category === "Alumni") {
    res.redirect("/alumniSignUp");
  }
  if (obj.category === "Student") {
    res.redirect("studentSignUp");
  }
  if (obj.category === "Staff") {
    res.redirect("staffSignUp");
  }
});

router.get("/alumniSignUp", function (req, res) {
  res.render("alumniSignUp");
});

router.get("/studentSignUp", function (req, res) {
  res.render("studentSignUp");
});

router.get("/staffSignUp", function (req, res) {
  res.render("staffSignUp");
});

// register logic
router.post("/studentSignUp", function (req, res) {
  const obj = JSON.parse(JSON.stringify(req.body));
  if (obj.password.length < 6) {
    req.flash("error", "password length must be greater than 6 Characters");
    res.redirect("/studentSignUp");
  } else if (obj.password !== obj.confirmPassword) {
    req.flash("error", "Password mismatch");
    res.redirect("/studentSignUp");
  } else {
    newStudentUser = new StudentUser({
      username: obj.username.trim(),
      Name: obj.name.trim(),
      StudentId: obj.studentId.trim(),
      Year: obj.year.trim(),
      Department: obj.dept.trim(),
      PhoneNo: obj.phoneno.trim(),
      isStudent: true,
    });
    StudentUser.findOne({ email: obj.email }, function (err, user) {
      if (!user) {
        newStudentUser.EmailId = obj.email.trim();
        async.waterfall([
          function (done) {
            StudentUser.register(
              newStudentUser,
              obj.password,
              function (err, user) {
                if (err) {
                  console.log(err);
                  req.flash("error", err.message);
                  return res.redirect("/studentSignUp");
                }
                passport.authenticate("local")(req, res, function () {
                  req.flash(
                    "success",
                    "Successfully registered as " + newStudentUser.username
                  );
                  res.redirect("/login");
                });
              }
            );
          },
          function (user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: "vijaiselvan2000@gmail.com",
                pass: process.env.GMAILPW,
              },
            });
            var mailOptions = {
              to: user.email,
              from: "vijaiselvan2000@mail.com",
              subject: "WELCOME TO ALUMNI NETWORK AND CAREER GUIDANCE PORTAL",
              text:
                "Hello,\n\n" +
                "Thankyou " +
                user.username +
                " for signing in\n\n" +
                "You are ready access our web portal " +
                "http://" +
                req.headers.host,
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              done(err);
            });
          },
        ]);
      } else if (err || user) {
        req.flash("error", "EmailID already exists");
        return res.redirect("/studentSignUp");
      }
    });
  }

  // newStudentUser = new StudentUser({
  //     username: obj.username.trim(),
  //     Name: obj.name.trim(),
  //     EmailId: obj.email.trim(),
  //     StudentId: obj.studentId.trim(),
  //     Year: obj.year.trim(),
  //     Department: obj.dept.trim(),
  //     PhoneNo: obj.phoneno.trim(),
  //     isStudent: true
  // });

  // StudentUser.register(newStudentUser, obj.password, function (err, user) {
  //     if (err) {
  //         console.log(err);
  //         req.flash("error", err.message);
  //         return res.redirect('/studentSignUp');
  //     }
  //     passport.authenticate('local')(req, res, function () {
  //         req.flash("success", "Successfully registered as " + newStudentUser.username);
  //         res.redirect('/login');
  //     })
  // })
  // ===================
});

router.post("/alumniSignUp", function (req, res) {
  const obj = JSON.parse(JSON.stringify(req.body));
  if (obj.password.length < 6) {
    req.flash("error", "password length must be greater than 6 Characters");
    res.redirect("/alumniSignUp");
  } else if (obj.password !== obj.confirmPassword) {
    req.flash("error", "Password mismatch");
    res.redirect("/alumniSignUp");
  } else {
    newAlumniUser = new AlumniUser({
      username: obj.username.trim(),
      Name: obj.name.trim(),
      CompanyName: obj.company.trim(),
      Designation: obj.designation.trim(),
      PassedOutYear: obj.passout.trim(),
      LinkedInID: obj.linkedIn.trim(),
      PhoneNo: obj.phoneno.trim(),
      isAlumni: true,
    });
    AlumniUser.findOne({ email: obj.email }, function (err, user) {
      if (!user) {
        newAlumniUser.EmailId = obj.email.trim();
        async.waterfall([
          function (done) {
            AlumniUser.register(
              newAlumniUser,
              obj.password,
              function (err, user) {
                if (err) {
                  console.log(err);
                  req.flash("error", err.message);
                  return res.redirect("/alumniSignUp");
                }
                passport.authenticate("local")(req, res, function () {
                  req.flash(
                    "success",
                    "Successfully registered as " + newAlumniUser.username
                  );
                  res.redirect("/login");
                });
              }
            );
          },
          function (user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: "vijaiselvan2000@gmail.com",
                pass: process.env.GMAILPW,
              },
            });
            var mailOptions = {
              to: user.email,
              from: "vijaiselvan2000@mail.com",
              subject: "WELCOME TO ALUMNI NETWORK AND CAREER GUIDANCE PORTAL",
              text:
                "Hello,\n\n" +
                "Thankyou " +
                user.username +
                " for signing in\n\n" +
                "You are ready access our web portal " +
                "http://" +
                req.headers.host,
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              done(err);
            });
          },
        ]);
      } else if (err || user) {
        req.flash("error", "EmailID already exists");
        return res.redirect("/alumniSignUp");
      }
    });
  }

  // newAlumniUser = new AlumniUser({
  //     username: obj.username.trim(),
  //     Name: obj.name.trim(),
  //     CompanyName: obj.company.trim(),
  //     Designation: obj.designation.trim(),
  //     PassedOutYear: obj.passout.trim(),
  //     LinkedInID: obj.linkedIn.trim(),
  //     PhoneNo: obj.phoneno.trim(),
  //     isAlumni: true
  // });

  // AlumniUser.register(newAlumniUser, obj.password, function (err, user) {
  //     if (err) {
  //         console.log(err);
  //         req.flash("error", err.message);
  //         return res.redirect('/alumniSignUp');
  //     }
  //     passport.authenticate('local')(req, res, function () {
  //         req.flash("success", "Successfully registered as " + newAlumniUser.username);
  //         res.redirect('/login');
  //     })
  // })
  // ===================
});

router.post("/staffSignUp", function (req, res) {
  const obj = JSON.parse(JSON.stringify(req.body));
  if (obj.password.length < 6) {
    req.flash("error", "password length must be greater than 6 Characters");
    res.redirect("/staffSignUp");
  } else if (obj.password !== obj.confirmPassword) {
    req.flash("error", "Password mismatch");
    res.redirect("/staffSignUp");
  } else {
    newStaffUser = new StaffUser({
      username: obj.username.trim(),
      Name: obj.name.trim(),
      StaffId: obj.staffId.trim(),
      Designation: obj.designation.trim(),
      Department: obj.dept.trim(),
      PhoneNo: obj.phoneno.trim(),
      isStaff: true,
    });
    StaffUser.findOne({ email: obj.email }, function (err, user) {
      if (!user) {
        newStaffUser.EmailId = obj.email.trim();
        async.waterfall([
          function (done) {
            StaffUser.register(
              newStaffUser,
              obj.password,
              function (err, user) {
                if (err) {
                  console.log(err);
                  req.flash("error", err.message);
                  return res.redirect("/staffSignUp");
                }
                passport.authenticate("local")(req, res, function () {
                  req.flash(
                    "success",
                    "Successfully registered as " + newStaffUser.username
                  );
                  res.redirect("/login");
                });
              }
            );
          },
          function (user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: "vijaiselvan2000@gmail.com",
                pass: process.env.GMAILPW,
              },
            });
            var mailOptions = {
              to: user.email,
              from: "vijaiselvan2000@mail.com",
              subject: "WELCOME TO ALUMNI NETWORK AND CAREER GUIDANCE PORTAL",
              text:
                "Hello,\n\n" +
                "Thankyou " +
                user.username +
                " for signing in\n\n" +
                "You are ready access our web portal " +
                "http://" +
                req.headers.host,
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              done(err);
            });
          },
        ]);
      } else if (err || user) {
        req.flash("error", "EmailID already exists");
        return res.redirect("/staffSignUp");
      }
    });
  }

  // newAlumniUser = new AlumniUser({
  //     username: obj.username.trim(),
  //     Name: obj.name.trim(),
  //     CompanyName: obj.company.trim(),
  //     Designation: obj.designation.trim(),
  //     PassedOutYear: obj.passout.trim(),
  //     LinkedInID: obj.linkedIn.trim(),
  //     PhoneNo: obj.phoneno.trim(),
  //     isAlumni: true
  // });

  // AlumniUser.register(newAlumniUser, obj.password, function (err, user) {
  //     if (err) {
  //         console.log(err);
  //         req.flash("error", err.message);
  //         return res.redirect('/alumniSignUp');
  //     }
  //     passport.authenticate('local')(req, res, function () {
  //         req.flash("success", "Successfully registered as " + newAlumniUser.username);
  //         res.redirect('/login');
  //     })
  // })
  // ===================
});

//logout
router.get("/logout", function (req, res) {
  req.flash("success", "Successfully logged out");
  req.logout();
  res.redirect("/login");
});

router.get("/select", middleware.isStudentLoggedin, function (req, res) {
  res.render("select");
});

router.get("/alumniChoice", middleware.isAlumniLoggedin, function (req, res) {
  res.render("alumniChoice");
});
router.get("/staff", function (req, res) {
  res.render("staff");
});

// USER PROFILE
router.get("/users/:id", function (req, res) {
  StudentUser.findById(req.params.id, function (err, foundUser) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      res.render("users/show", { user: foundUser });
    }
  });
});

// Companies
router.get("/placement", middleware.isStudentLoggedin, function (req, res) {
  res.render("placement/companies");
});

router.get("/meetups", middleware.isStudentLoggedin, function (req, res) {
    res.render("meetups/meetups");
  });

// placementReview - alumni
router.get('/placementReview', middleware.isAlumniLoggedin, function (req, res) {
    res.render('placement/placementReview');
});

router.get('/higherStudiesReview', middleware.isAlumniLoggedin, function (req, res) {
    res.render('higherStudies/higherStudiesReview');
});

//higher studies -  student
router.get('/higherStudies', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/index');
});

router.get('/higherStudies/ms', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/ms');
});

router.get('/higherStudies/ms/qPaper', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/questionpaper-ms');
});

router.get('/higherStudies/ms/sMaterial', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/studymaterial-ms');
});

router.get('/higherStudies/mba', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/mba');
});

router.get('/higherStudies/mba/qPaper', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/questionpaper-mba');
});

router.get('/higherStudies/mba/sMaterial', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/studymaterial-mba');
});

router.get('/higherStudies/mtech', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/mtech');
});

router.get('/higherStudies/mtech/qPaper', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/questionpaper-mtech');
});

router.get('/higherStudies/mtech/sMaterial', middleware.isStudentLoggedin, function (req, res) {
    res.render('higherStudies/studymaterial-mtech');
});

module.exports = router;
