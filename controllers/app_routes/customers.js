var express = require('express'),
    router = express.Router(),
    accountController = require('../../models/accountController'),
    form_validation = require('./handlers/form_validation'),
    moment = require('moment'),
    accessHandler = require('./handlers/roles'),
    userRole;

router.use(function(req,res,next){
    userRole = res.locals.userRole;
    next();
});

router.get('/registration',function(req,res){
    var permission = accessHandler.ac.can(userRole).createAny('customer');
    if (permission.granted) {
        res.render('customer_registration', {
            pageTitle: "Customer registration",
            siteName: res.locals.siteTitle,
            errors: req.session.errors,
            user: req.session.user,
            role: req.session.role
        });
    }else{
        res.status(403).send(accessHandler.errors.create_account).end();
    }
});

router.get('/:customer_id',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('customer');
    if (permission.granted){
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
    }else{
        res.status(403).send(accessHandler.errors.read_page).end();
    }
});

router.get('/',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('customer');
    if(permission.granted){
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
            res.render('customer_browse', {
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
    }else{
        res.status(403).send(accessHandler.errors.read_page).end();
    }
});
/*POST requests*/

//Submission of new customer form. The form is validated, verified and used to create a new customer.
router.post('/registration/submit',function(req,res){
    var permission = accessHandler.ac.can(userRole).createAny('customer');
    if(permission.granted){
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
            console.error(err);
        });
        },function(err){ // Form handlers error handling
            req.session.errors = err;
            res.redirect('/customers/registration');
            done(console.error(err));
        });
    }else{
        res.status(403).send(accessHandler.errors.create_account).end();
    }

});

//Modification of customer stored phone data.
router.post('/edit/phone_number',function(req,res){
    var permission = accessHandler.ac.can(userRole).updateAny('customer');
    if(permission.granted){
        var customer_id = req.body.customer_id,
            phone_number = req.body.phone_number;
        if(phone_number){
            form_validation.validate_phone_number(phone_number).then(function(data){accountController.edit_customer_phone_number(data,customer_id).then(function(data){
                    console.log(data);
                    res.redirect('/customers/'+customer_id);
                },function(err){
                    console.log(err);
                    //req.session.errors.push(err);
                    res.redirect('/customers/'+customer_id);
                })},
                function(err){
                    console.log(err);
                    //req.session.push(err);
                    res.redirect('/customers/'+customer_id);
                })
        }
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }
});

//Modification of customer stored email address data
router.post('/edit/email',function(req,res){
    var permission = accessHandler.ac.can(userRole).updateAny('dentist');
    if(permission.granted){
        var customer_id = req.body.customer_id,
            email = req.body.email;
        if(email){
            form_validation.validate_email(email).then(function(data){accountController.edit_customer_email(data,customer_id).then(function(data){
                    console.log(data);
                    res.redirect('/customers/'+customer_id);
                },function(err){
                    console.log(err);
                    //req.session.errors.push(err);
                    res.redirect('/customers/'+customer_id);
                })},
                function(err){
                    console.log(err);
                    //req.session.push(err);
                    res.redirect('/customers/'+customer_id);
                })
        }
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }
});

router.post('/delete',function(req,res){
    var permission = accessHandler.ac.can(userRole).deleteAny('customer');
    if(permission.granted){
        accountController.delete_customer(req.body.customer_id).then(function(data){
            console.log(data);
            res.redirect('/customers');
        },function(err){
            console.log(err);
            res.redirect('/customers/'+customer_id);
        })
    }else{
        res.status(403).send(accessHandler.errors.delete_account).end();
    }
});

module.exports = router;