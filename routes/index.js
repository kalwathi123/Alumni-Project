var express = require('express');
var router = express.Router();

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
        res.render('alumniSignUp');
    }
    if(obj.category === 'Student'){
        res.render('studentSignUp');
    }
    if(obj.category === 'Staff'){
        res.render('staffSignUp');
    }
})

module.exports = router;
