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
    console.log(userRole);
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
    var permission = accessHandler.ac.can(userRole).deleteAny('dentist');
    if(permission.granted){
        accountController.delete_dentist(req.body.dentist_id).then(function(data){
            console.log(data);
            res.redirect('/dentist');
        },function(err){
            console.log(err);
            res.redirect('/dentist/'+dentist_id);
        })
    }else{
        res.status(403).send(accessHandler.errors.delete_account).end();
    }

});

//Modification of dentist data
router.post('/edit/phone_number',function(req,res){
    var permission = accessHandler.ac.can(userRole).updateAny('dentist');
    if(permission.granted){
        var id = req.body.id,
            phone_number = req.body.phone_number;
        if(phone_number){
            form_validation.validate_phone_number(phone_number).then(function(data){accountController.edit_dentist_phone_number(data,id).then(function(data){
                    console.log(data);
                    res.redirect('/dentist/'+id);
                },function(err){
                    console.log(err);
                    //req.session.errors.push(err);
                    res.redirect('/dentist/'+id);
                })},
                function(err){
                    console.log(err);
                    //req.session.push(err);
                    res.redirect('/dentist/'+id);
                })
        }
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }
});
router.post('/edit/email',function(req,res){
    var permission = accessHandler.ac.can(userRole).updateAny('dentist');
    if(permission.granted){
        var id = req.body.id,
            email = req.body.email;
        if(email){
            form_validation.validate_email(email).then(function(data){accountController.edit_dentist_email(data,id).then(function(data){
                    console.log(data);
                    res.redirect('/dentist/'+id);
                },function(err){
                    console.log(err);
                    //req.session.errors.push(err);
                    res.redirect('/dentist/'+id);
                })},
                function(err){
                    console.log(err);
                    //req.session.push(err);
                    res.redirect('/dentist/'+id);
                })
        }
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }
});

router.post('/registration/submit',function(req,res){
    var permission = accessHandler.ac.can(userRole).createAny('dentist');
    if(permission.granted){
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
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }

});

module.exports = router;