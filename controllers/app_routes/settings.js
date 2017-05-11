var express = require('express'),
    accessHandler = require('./handlers/roles'),
    dataController = require('../../models/dataController'),
    moment = require('moment'),
    async = require('async'),
    Promise = require('promise'),
    router = express.Router();

var userRole;

/*
Middleware that checks if the user is logged in or not.
 */
router.use(function(req,res,next){
    if(!req.session || typeof req.session.user === 'undefined'){
        res.redirect('/login');
    }else{
        next();
    }
});

/*
Middleware that sets the role to default name if the user is not logged in
 */
router.use(function(req,res,next){
    userRole = res.locals.userRole;
    next();
});

router.get('/',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('settings');
    if (permission.granted) {
        var data = load_settings();
        load_settings().then(function(data){
            res.render('settings', {
                pageTitle: "Settings",
                siteName: res.locals.siteTitle,
                errors: req.session.errors,
                user: req.session.user,
                role: req.session.role,
                data: data
            });
        })
    }else{
        res.status(403).end();
    }
});

router.post('/change_working_hours',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('settings');
    if (permission.granted) {
        var data = req.body;
        dataController.update_business_working_hours(data).then(function(list){
            get_business_working_hours(req,res);
        })
    }
});

router.post('/change_mail_delivery_time',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('settings');
    if(permission.granted){
        dataController.update_mail_delivery_time(req.body.time).then(function(settings){
            res.status(200);
            res.render('./content/settings/mail_delivery_time',{
                data: settings
            });
        });
    }
});

router.post('/',function(req,res){
    get_business_working_hours(req,res);
});

/*
All of the settings are loaded from here at the start of the server.
In case the settings file is missing from the database, a new one is created with default values.

New implemented settings should be added here.
 */
var load_settings = function(){
    return new Promise(function(fulfill,reject){
        dataController.create_settings_file();
        var delivery_time = dataController.get_mail_delivery_time();
        var business_working_hours = dataController.get_business_working_hours();

        Promise.all([
            business_working_hours,
            delivery_time

        ]).then(function(data){
            fulfill ({
                working_days:data[0],
                mail_delivery_time: data[1]
            });
        })
    });
};

/*
Returns an array of objects for opening hours of each day of the week
 */
var get_business_working_hours = function(req,res){
    dataController.get_business_working_hours().then(function(working_days){
        res.status(200);
        res.render('./content/settings/working_hours',{
            working_days:working_days,
            weekdays: moment.weekdays()
        });
    });
};

module.exports = router;