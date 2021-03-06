var express = require('express'),
    router = express.Router(),
    dataController = require('../../models/dataController'),
    form_validation = require('./handlers/form_validation'),
    email_handler = require('./handlers/email_handler'),
    moment = require('moment'),
    accessHandler = require('./handlers/roles'),
    userRole;

router.use(function(req,res,next){
    userRole = res.locals.userRole;
    next();
});

//registration route
router.route('/registration')
    .all(function(req,res,next){
        var permission = accessHandler.ac.can(userRole).createAny('dentist');
        if(permission.granted) {
            next();
        }else{
            res.status(403).send(accessHandler.errors.read_page).end();
        }
    })
    .get(function(req,res){
            res.render('dentist_registration',{
                pageTitle: "Dentist registration",
                siteName: res.locals.siteTitle,
                errors: req.session.errors,
                user: req.session.user,
                role: req.session.role
            });
    })
    .post(function(req,res){
        var form = {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            date_of_birth: req.body.date_of_birth,
            phone_number: req.body.phone_number
        };
        form_validation.validate_dentist_form(form).then(function(data){dataController.create_dentist_account(data).then(function(account){
            email_handler.sendGreetingEmail(account);
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

router.get('/:dentist_id',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('dentist');
    if (permission.granted){
        dataController.find_dentist(req.params.dentist_id).then(function(data){
            var dentist_data = {
                name : data.account_info.name,
                gender: data.account_info.gender.charAt(0).toUpperCase() + data.account_info.gender.slice(1),
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
        dataController.get_all_dentists().then(function(data) {
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
        dataController.delete_dentist(req.body.dentist_id).then(function(removed_account){
            email_handler.sendRemovedAccountNotification(removed_account);
            dataController.get_appointments(removed_account._id).then(function(list){
               if(list){
                   list.forEach(function(appointment){
                       dataController.delete_appointment(appointment._id);
                       dataController.find_client(appointment.client_id).then(function(client){
                           email_handler.sendDentistCanceledAppointmentNotification({client:client, dentist: removed_account});
                       },function(err){
                           console.error(err);
                       });
                   });
               }
            });
            res.redirect('/dentist');
        },function(err){
            console.error(err);
            res.redirect('/dentist/'+req.body.dentist_id);
        })
    }else{
        res.status(403).send(accessHandler.errors.delete_account).end();
    }

});

//Modification of dentist account
router.post('/edit/phone_number',function(req,res){
    var permission = accessHandler.ac.can(userRole).updateAny('dentist');
    if(permission.granted){
        var id = req.body.id,
            phone_number = req.body.phone_number;
        if(phone_number){
            form_validation.validate_phone_number(phone_number).then(function(data){dataController.edit_dentist_phone_number(data,id).then(function(data){
                    res.redirect('/dentist/'+id);
                },function(err){
                    console.error(err);
                    //req.session.errors.push(err);
                    res.redirect('/dentist/'+id);
                })},
                function(err){
                    console.error(err);
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
            form_validation.validate_email(email).then(function(data){dataController.edit_dentist_email(data,id).then(function(data){
                    res.redirect('/dentist/'+id);
                },function(err){
                    console.error(err);
                    //req.session.errors.push(err);
                    res.redirect('/dentist/'+id);
                })},
                function(err){
                    console.error(err);
                    //req.session.push(err);
                    res.redirect('/dentist/'+id);
                })
        }
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }
});

module.exports = router;