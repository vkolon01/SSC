var express = require('express'),
    router = express.Router(),
    dataController = require('../models/dataController'),
    form_validation = require('./app_routes/handlers/form_validation'),
    accessHandler = require('./app_routes/handlers/roles'),
    userRole;

router.use(function(req,res,next){
    userRole = res.locals.userRole;
    next();
});

dataController.check_collection().then(function(result){
    if(!result){
        var administrator = {
            name : "Initial account",
            username : "administrator",
            phone_number : "123456789",
            email : "administrator@someemail.com",
            date_of_birth : new Date,
            role : "admin",
            password: "administrator",
            password_confirm: "administrator",
            hash: '',
            gender: "female"
        };
        form_validation.validate_staff_form(administrator).then(function(form){
            dataController.create_staff_account(form);
        });
    }
});

router.get('/',function(req,res){
    var userRole = res.locals.userRole;
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

router.route('/change_password')
    .all(function(req,res,next){
        var permission = accessHandler.ac.can(userRole).updateOwn('password');
        if(permission.granted) {
            next();
        }else{
            res.status(403).send(accessHandler.errors.read_page).end();
        }
    })
    .get(function(req,res){
        res.render('change_password',{
            pageTitle: "Change password",
            siteName: res.locals.siteTitle,
            errors: req.session.errors,
            user: req.session.user,
            role: req.session.role
        });
    })
    .post(function(req,res){
        var form = {
            password: req.body.old_password,
            new_password: req.body.new_password,
            new_password_confirm: req.body.new_password_confirm,
            username: req.session.user,
            hash: ''
        };
        form_validation.validate_password(form).then(function(hash){
            form.hash = hash;
            dataController.authorize(form).then(function(user){
                dataController.change_password(form).then(function(message){
                    console.log(message);
                    res.redirect('/');
                })
            },function(err){
                console.error(err);
                res.redirect('/change_password');
            })
        },function(err){
            console.error(err);
            res.redirect('/change_password');
        })
    });


router.post('/submit',function(req,res){
    var userRole = res.locals.userRole;
    var permission = accessHandler.ac.can(userRole).createAny(req.body.role);
    if(permission.granted){
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
            gender: req.body.gender
        };
        form_validation.validate_staff_form(form).then(function(form){dataController.create_staff_account(form).then(function(data){
           res.redirect('/');
        },function(err){// Account creation error handling
            res.redirect('/registration');
            throw err;
        });
        },function(err){ // Form handlers error handling
            req.session.errors = err;
            res.redirect('/registration');
            throw err
        });
    }else{
        res.status(403).send(accessHandler.errors.create_account).end();
    }
});
module.exports = router;