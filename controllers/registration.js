var express = require('express'),
    router = express.Router(),
    accountController = require('../models/accountController'),
    form_validation = require('./app_routes/handlers/form_validation');


router.get('/',function(req,res){
    req.session.err = null;
    res.render('register',{
        pageTitle: "Register",
        siteName: res.locals.siteTitle,
        errors: req.session.errors,
        user: req.session.user,
        role: req.session.role
    });
});


router.post('/submit',function(req,res){
    var form = {
        name : req.body.name,
        username : req.body.username,
        phone_number : req.body.phone_number,
        email : req.body.email,
        date_of_birth : req.body.date_of_birth,
        role : req.body.role,
        password: req.body.password,
        password_confirm: req.body.password_confirm,
        hash: ''
    };
    form_validation.validate_staff_form(form).then(function(data){accountController.create_staff_account(data).then(function(data){
        res.redirect('/');
        },function(err){// Account creation error handling
            res.redirect('/registration');
            done(console.error(err));
        });
    },function(err){ // Form handlers error handling
            req.session.errors = err;
            res.redirect('/registration');
            done(console.error(err));
        });
});
module.exports = router;