var express = require('express'),
    async = require('async'),
    router = express.Router(),
    mongoose = require('mongoose'),
    accountController = require('../models/accountController'),
    form_validation = require('./validation/form_validation');
//User models
router.get('/',function(req,res){

    res.render('register',{
        pageTitle: "Register",
        siteName: res.locals.siteTitle
    })
});

router.post('/submit',function(req,res){

    async.series([
        function(callback){
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
            callback(null,form_validation.validate_form(form));
        }
    ],function(err, validated_form){
        console.log('validated form below');
        console.log(validated_form);
        accountController.create_account(validated_form);
        res.redirect('/');
    });



});
module.exports = router;