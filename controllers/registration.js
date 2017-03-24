var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    accountController = require('../models/accountController'),
    form_validation = require('./validation/form_validation');
//User models
router.get('/',function(req,res){
    console.log(req.session.errors);
    res.render('register',{
        pageTitle: "Register",
        siteName: res.locals.siteTitle,
        errors: req.session.errors
    });
    req.session.errors = '';
});

router.post('/submit',function(req,res){
    var curURL = req.url;
    var form = {
        name : req.body.name,
        username : req.body.username,
        phone_number : req.body.phone_number,
        email : req.body.email,
        date_of_birth : req.body.date_of_birth,
        role : req.body.role,
        password: req.body.password,
        password_confirm: req.body.password_confirm,
        hash: '',
        account_id : ''
    };
    form_validation.validate_form(form).then(function(data){
        accountController.create_account(data).then(function(data){

        });
    },function(err){
        req.session.errors = err;
        res.redirect('/register');
        done();
    });


});
module.exports = router;