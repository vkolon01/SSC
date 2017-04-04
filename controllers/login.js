var express = require('express'),
    router = express.Router(),
    accountController = require('../models/accountController');

router.use(function(req,res,next){
    if(req.session && typeof req.session.user !== 'undefined'){
        res.redirect('/home');
    }else{
        next();
    }
});

router.get('/',function(req,res){
    res.render('login',{
        pageTitle: "Home",
        siteName: res.locals.siteTitle,
        errors: req.session.errors
    });
    req.session.errors = null;

});

router.post('/submit',function(req,res){
    var form = {
        username: req.body.username,
        password: req.body.password
    };
    accountController.login(form).then(function(data){
        req.session.user = data.username;
        req.session.role = data.role;
        res.redirect('/home');
        done();
    },function(err){
        req.session.errors = err;

        res.redirect('/login');
    });
});

module.exports = router;