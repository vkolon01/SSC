var express = require('express'),
    async = require('async'),
    router = express.Router(),
    crypt = require('password-hash-and-salt'),
    mongoose = require('mongoose');

//User models
var accountController = require('../models/accountController'),
    generalManagerModel = accountController.generalManager({}),
    assistantManagerModel = accountController.assistantManager({}),
    receptionistModel = accountController.receptionist({}),
    loginDataModel = accountController.loginData({}),
    customerModel = accountController.customer({});

router.get('/',function(req,res){

    res.render('register',{
        pageTitle: "Register",
        siteName: res.locals.siteTitle
    })
});

router.post('/submit',function(req,res){

    var name = req.body.name,
        username = req.body.username,
        email = req.body.email,
        date_of_birth = req.body.date_of_birth,
        hash;
    if(req.body.password === req.body.password_confirm){
        crypt(req.body.password).hash(function(err,hashed_password){
            if(err) throw(err);
            hash = hashed_password;
        });
    }

    //If the input is validated the user is saved.
async.parallel([
    function(callback){
        var loginData = new loginDataModel({
            username: username,
            hash:hash,
            role:"General_manager"
        })
    },
    function(callback){

    }
],
function(err){
    if(err) return next(err);
})


});
module.exports = router;