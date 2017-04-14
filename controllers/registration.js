var express = require('express'),
    router = express.Router(),
    accountController = require('../models/accountController'),
    form_validation = require('./app_routes/handlers/form_validation'),
    accessHandler = require('./app_routes/handlers/roles');

var userRole = 'guest';

router.use(function(req,res,next){
    if(typeof req.session !== 'undefined' && typeof req.session.role !== 'undefined' && accessHandler.roles.indexOf(req.session.role) !== -1){
        userRole = req.session.role;
    }
    next();
});

router.get('/',function(req,res){
    req.session.err = null;
    var permission = accessHandler.ac.can(userRole).readAny('registration');
    if(permission.granted){
        res.render('register',{
            pageTitle: "Register",
            siteName: res.locals.siteTitle,
            errors: req.session.errors,
            user: req.session.user,
            role: req.session.role
        });
    }else{
        res.status(403).send(accessHandler.errors.read_page).end();
    }
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
    var permission = accessHandler.ac.can(userRole).createAny(form.role);
    if(permission.granted){
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
    }else{
        res.status(403).send(accessHandler.errors.create_account).end();
    }


});
module.exports = router;