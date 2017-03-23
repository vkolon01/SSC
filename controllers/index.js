var express = require('express'),
    router = express.Router();

router.use('/home', require('./home'));
router.use('/users',require('./users'));
router.use('/login',require('./login'));
router.use('/registration',require('./registration'));

//TEMPORARY GENERAL MANAGER REGISTER PAGE
router.get('/register',function(req,res){

    res.render('register',{
        pageTitle: "Register",
        siteName: res.locals.siteTitle
    })
});

module.exports = router;