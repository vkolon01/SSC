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

router.get('/registration',function(req,res){
    var permission = accessHandler.ac.can(userRole).createAny('client');
    if (permission.granted) {
        res.render('client_registration', {
            pageTitle: "Client registration",
            siteName: res.locals.siteTitle,
            errors: req.session.errors,
            user: req.session.user,
            role: req.session.role
        });
    }else{
        res.status(403).send(accessHandler.errors.create_account).end();
    }
});

router.get('/:client_id',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('client');
    if (permission.granted){
        dataController.find_client(req.params.client_id).then(function(data){
            //Client data
            var client_data = {
                name : data.account_info.name,
                id: data._id,
                gender: data.account_info.gender.charAt(0).toUpperCase() + data.account_info.gender.slice(1),
                registration_date: moment(data.registration_date).format('DD-MM-YYYY'),
                date_of_birth: moment(data.account_info.date_of_birth).format('DD-MM-YYYY'),
                age: moment(moment(data.account_info.date_of_birth).format("YYYY"),"YYYY").fromNow().replace('ago','old'),
                phone_number:data.account_info.phone_number,
                email:data.account_info.email
            };

            //Dentist list collection
            var list = [];
            dataController.get_all_dentists().then(function(dentist_list){
                res.render('client_page',{
                    pageTitle: "Client page",
                    siteName: res.locals.siteTitle,
                    errors: req.session.errors,
                    user: req.session.user,
                    role: req.session.role,
                    client_data: client_data,
                    dentist_list: dentist_list
                });
            },function(err){
                req.session.errors.push(err);
                res.redirect('/home');
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
    var permission = accessHandler.ac.can(userRole).readAny('client');
    if(permission.granted){
        dataController.get_all_clients().then(function(data) {
            var client_list = [{}];
            data.forEach(function (client) {
                client_list.push({
                    name: client.account_info.name,
                    id: client._id,
                    registration_date: moment(client.registration_date).format('DD-MM-YYYY'),
                    date_of_birth: moment(client.account_info.date_of_birth).format('DD-MM-YYYY'),
                    age: moment(moment(client.account_info.date_of_birth).format("YYYY"), "YYYY").fromNow().replace('ago', 'old'),
                    phone_number: client.account_info.phone_number,
                    email: client.account_info.email
                });
                console.log(client)
            });
            res.render('client_browse', {
                pageTitle: "Client page",
                siteName: res.locals.siteTitle,
                errors: req.session.errors,
                user: req.session.user,
                role: req.session.role,
                client_list: client_list
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

//Submission of new client form. The form is validated, verified and used to create a new client.
router.post('/registration/submit',function(req,res){
    console.log(req.body);
    var permission = accessHandler.ac.can(userRole).createAny('client');
    if(permission.granted){
        var form = {
            name : req.body.name,
            phone_number : req.body.phone_number,
            email : req.body.email,
            date_of_birth : req.body.date_of_birth,
            gender : req.body.gender
        };

        form_validation.validate_client_form(form).then(function(data){dataController.create_client_account(data).then(function(data){
            res.redirect('/clients/'+data._id);
        },function(err){// Account creation error handling
            res.redirect('/clients/registration');
            console.error(err);
        });
        },function(err){ // Form handlers error handling
            req.session.errors = err;
            res.redirect('/clients/registration');
            done(console.error(err));
        });
    }else{
        res.status(403).send(accessHandler.errors.create_account).end();
    }

});

//Modification of client stored phone data.
router.post('/edit/phone_number',function(req,res){
    var permission = accessHandler.ac.can(userRole).updateAny('client');
    if(permission.granted){
        var client_id = req.body.client_id,
            phone_number = req.body.phone_number;
        if(phone_number){
            form_validation.validate_phone_number(phone_number).then(function(data){dataController.edit_client_phone_number(data,client_id).then(function(data){
                    console.log(data);
                    res.redirect('/clients/'+client_id);
                },function(err){
                    console.log(err);
                    //req.session.errors.push(err);
                    res.redirect('/clients/'+client_id);
                })},
                function(err){
                    console.log(err);
                    //req.session.push(err);
                    res.redirect('/clients/'+client_id);
                })
        }
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }
});

//Modification of client stored email address data
router.post('/edit/email',function(req,res){
    var permission = accessHandler.ac.can(userRole).updateAny('dentist');
    if(permission.granted){
        var client_id = req.body.client_id,
            email = req.body.email;
        if(email){
            form_validation.validate_email(email).then(function(data){dataController.edit_client_email(data,client_id).then(function(data){
                    console.log(data);
                    res.redirect('/clients/'+client_id);
                },function(err){
                    console.log(err);
                    //req.session.errors.push(err);
                    res.redirect('/clients/'+client_id);
                })},
                function(err){
                    console.log(err);
                    //req.session.push(err);
                    res.redirect('/clients/'+client_id);
                })
        }
    }else{
        res.status(403).send(accessHandler.errors.other).end();
    }
});

router.post('/delete',function(req,res){
    var permission = accessHandler.ac.can(userRole).deleteAny('client');
    if(permission.granted){
        dataController.delete_client(req.body.client_id).then(function(client){
            dataController.get_appointments(client._id).then(function(list){
                console.log(list);
                if(list.length > 0){
                    list.forEach(function(appointment){
                        dataController.find_dentist(appointment.dentist_id).then(function(dentist){
                            email_handler.sendDentistCanceledAppointmentNotification({client:client, dentist: dentist});
                            dataController.delete_appointment(appointment._id)
                        });
                    });
                }
            });
            res.redirect('/clients');
        },function(err){
            console.log(err);
            res.redirect('/clients/'+client_id);
        })
    }else{
        res.status(403).send(accessHandler.errors.delete_account).end();
    }
});

module.exports = router;