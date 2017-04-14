var express = require('express'),
    router = express.Router(),
    accountController = require('../../models/accountController'),
    form_validation = require('./handlers/form_validation'),
    moment = require('moment'),
    accessHandler = require('./handlers/roles');

var userRole = 'guest';
router.use(function(req,res,next){
    if(typeof req.session !== 'undefined' && typeof req.session.role !== 'undefined' && accessHandler.roles.indexOf(req.session.role) !== -1){
        userRole = req.session.role;
    }
    next();
});


router.get('/registration',function(req,res){
    console.log('whatsup');
    var permission = accessHandler.ac.can(userRole).createAny('dentist');
    if(permission.granted){
        res.render('dentist_registration',{
            pageTitle: "Dentist registration",
            siteName: res.locals.siteTitle,
            errors: req.session.errors,
            user: req.session.user,
            role: req.session.role
        });
    }else{
        res.status(403).send(accessHandler.errors.read_page).end();
    }
});

router.get('/:dentist_id',function(req,res){

    var permission = accessHandler.ac.can(userRole).readAny('dentist');
    if (permission.granted){
        accountController.find_dentist(req.params.dentist_id).then(function(data){
            var dentist_data = {
                name : data.account_info.name,
                id: data._id,
                date_of_birth: moment(data.account_info.date_of_birth).format('DD-MM-YYYY'),
                age: moment(moment(data.account_info.date_of_birth).format("YYYY"),"YYYY").fromNow().replace('ago','old'),
                phone_number:data.account_info.phone_number,
                email:data.account_info.email
            };
            res.render('dentist_page',{
                pageTitle: "Dentist page",
                siteName: res.locals.siteTitle,
                errors: req.session.errors,
                user: req.session.user,
                role: req.session.role,
                dentist_data: dentist_data
            });
        },function(err){
            req.session.errors.push(err);
            res.redirect('/home');
        });
    }else{
        res.status(403).end();
    }
});
router.get('/',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('dentist');
    if(permission.granted){
        accountController.get_all_dentists().then(function(data) {
            var list = [{}];

            data.forEach(function (account) {
                list.push({
                    name: account.account_info.name,
                    id: account._id,
                    date_of_birth: moment(account.account_info.date_of_birth).format('DD-MM-YYYY'),
                    age: moment(moment(account.account_info.date_of_birth).format("YYYY"), "YYYY").fromNow().replace('ago', 'old'),
                    phone_number: account.account_info.phone_number,
                    email: account.account_info.email
                })
            });
            res.render('dentist_browse', {
                pageTitle: "All dentists page",
                siteName: res.locals.siteTitle,
                errors: req.session.errors,
                user: req.session.user,
                role: req.session.role,
                dentist_list: list
            })
        },function(err){
            req.session.errors.push(err);
            res.redirect('/home');
        });
    }else{
        res.status(403).send(accessHandler.errors.read_page).end();
    }
});


router.post('/delete',function(req,res){
    accountController.delete_dentist(req.body.dentist_id).then(function(data){
        console.log(data);
        res.redirect('/dentist');
    },function(err){
        console.log(err);
        res.redirect('/dentist/'+dentist_id);
    })
});

router.post('/registration/submit',function(req,res){
    var form = {
        name: req.body.name,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        phone_number: req.body.phone_number
    };
    form_validation.validate_dentist_form(form).then(function(data){accountController.create_dentist_account(data).then(function(data){
        res.redirect('/');
    },function(err){//Account creation error
        res.redirect('/dentist/registration');
        done(console.error(err));
    });
    },function(err){//Form errors
        req.session.errors = err;
        res.redirect('/dentist/registration');
        console.error(err);
        done();
    })
});

module.exports = router;