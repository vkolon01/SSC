var express = require('express'),
    accessHandler = require('./handlers/roles'),
    dataController = require('../../models/dataController'),
    moment = require('moment'),
    router = express.Router();

var userRole;

router.use(function(req,res,next){
    if(!req.session || typeof req.session.user === 'undefined'){
        res.redirect('/login');
    }else{
        next();
    }
});

router.use(function(req,res,next){
    userRole = res.locals.userRole;
    next();
});

router.get('/',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('settings');
    if (permission.granted) {
            res.render('settings', {
                pageTitle: "Settings",
                siteName: res.locals.siteTitle,
                errors: req.session.errors,
                user: req.session.user,
                role: req.session.role
            });
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

router.post('/',function(req,res){
    get_business_working_hours(req,res);
});

var get_business_working_hours = function(req,res){
    dataController.get_business_working_hours().then(function(working_days){
        res.status(200);
        res.render('./content/settings_table',{
            working_days:working_days,
            weekdays: moment.weekdays()
        });
    });
};

module.exports = router;