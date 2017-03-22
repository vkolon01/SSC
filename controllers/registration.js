var express = require('express'),
    async = require('async'),
    router = express.Router(),
    crypt = require('password-hash-and-salt'),
    mongoose = require('mongoose');

//User models
    var accountController = require('../models/accountController');
    /*
    generalManagerModel = accountController.generalManager({}),
    assistantManagerModel = accountController.assistantManager({}),
    receptionistModel = accountController.receptionist({}),
    loginDataModel = accountController.loginData({}),
    customerModel = accountController.customer({});
*/
    var models = accountController.models;
router.get('/',function(req,res){

    res.render('register',{
        pageTitle: "Register",
        siteName: res.locals.siteTitle
    })
});

router.post('/submit',function(req,res){

    var name = req.body.name,
        username = req.body.username,
        phone_number = req.body.phone_number,
        email = req.body.email,
        date_of_birth = req.body.date_of_birth,
        role = req.body.role,
        hash,
        account_id = '';
    if(req.body.password === req.body.password_confirm){
        crypt(req.body.password).hash(function(err,hashed_password){
            if(err) throw(err);
            hash = hashed_password;
        });
    }

    //If the input is validated the user is saved.
    async.series([
        function(callback){
            account_id = accountController.createReceptionist(name,phone_number,date_of_birth);
        },
        function(callback){
            var loginData = new models[0]({
                username: username,
                hash:hash,
                role:role,
                account_id: account_id
            });
            loginData.save(function(err,data){
               console.log(data._id);
            });
        },
        function(callback){

        }
    ],
    function(err){
        if(err) return next(err);
    })


});
module.exports = router;