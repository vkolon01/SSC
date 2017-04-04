var express = require('express'),
    router = express.Router(),
    accountController = require('../../models/accountController'),
    form_validation = require('../app_routes/validation/form_validation'),
    moment = require('moment');
/*
middleware to redirect any unregistered user back to login page
*/
router.use(function(req,res,next){
    if(!req.session || typeof req.session.user === 'undefined'){
        res.redirect('/login');
    }else{
        next();
    }
});

router.get('/registration',function(req,res){
    req.session.err = null;
    res.render('customer_registration',{
        pageTitle: "Customer registration",
        siteName: res.locals.siteTitle,
        errors: req.session.errors,
        user: req.session.user,
        role: req.session.role
    });
});

router.get('/:customer_id',function(req,res){
        accountController.find_customer(req.params.customer_id).then(function(data){
            var customer_data = {
                name : data.account_info.name,
                id: data._id,
                registration_date: moment(data.registration_date).format('DD-MM-YYYY'),
                date_of_birth: moment(data.account_info.date_of_birth).format('DD-MM-YYYY'),
                age: moment(moment(data.account_info.date_of_birth).format("YYYY"),"YYYY").fromNow().replace('ago','old'),
                phone_number:data.account_info.phone_number,
                email:data.account_info.email
            };
            console.log('what is going onnn');
            res.render('customer_page',{
                pageTitle: "Customer page",
                siteName: res.locals.siteTitle,
                errors: req.session.errors,
                user: req.session.user,
                role: req.session.role,
                customer_data: customer_data
            });
        },function(err){
            req.session.errors.push(err);
            res.redirect('/home');
        });
});

router.get('/',function(req,res){
    accountController.get_all_customers().then(function(data) {
        var customer_list = [{}];

        data.forEach(function (customer) {
            customer_list.push({
                name: customer.account_info.name,
                id: customer._id,
                registration_date: moment(customer.registration_date).format('DD-MM-YYYY'),
                date_of_birth: moment(customer.account_info.date_of_birth).format('DD-MM-YYYY'),
                age: moment(moment(customer.account_info.date_of_birth).format("YYYY"), "YYYY").fromNow().replace('ago', 'old'),
                phone_number: customer.account_info.phone_number,
                email: customer.account_info.email
            })
        });
        res.render('browse_customers', {
            pageTitle: "Customer page",
            siteName: res.locals.siteTitle,
            errors: req.session.errors,
            user: req.session.user,
            role: req.session.role,
            customer_list: customer_list
        })
    },function(err){
        req.session.errors.push(err);
        res.redirect('/home');
    });
});

router.post('/search',function(req,res){

    if(req.body.id.length > 0){accountController.find_customer(req.body.id).then(function(data){res.redirect('/customers/'+data._id);},function(err){
        res.redirect('/customers');
    })}else{
        if(req.body.email.length > 0){accountController.find_customer_by_email(req.body.email).then(function(data){res.redirect('/customer/'+data._id);},function(err){
            res.redirect('/customers');
        })}
        res.redirect('/customers');
    }
});

router.post('/registration/submit',function(req,res){
    var form = {
        name : req.body.name,
        phone_number : req.body.phone_number,
        email : req.body.email,
        date_of_birth : req.body.date_of_birth
    };

    form_validation.validate_customer_form(form).then(function(data){accountController.create_customer_account(data).then(function(data){
        res.redirect('/customers/'+data._id);
    },function(err){// Account creation error handling
        res.redirect('/customers/registration');
        done(console.error(err));
    });
    },function(err){ // Form validation error handling
        req.session.errors = err;
        res.redirect('/customers/registration');
        done(console.error(err));
    });
});
module.exports = router;