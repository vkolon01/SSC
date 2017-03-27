var express = require('express'),
    router = express.Router(),
    crypt = require('password-hash-and-salt');

//User models
/*var accountController = require('../models/accountController'),
    generalManager = accountController.generalManager({}),
    assistantManager = accountController.assistantManager({}),
    customer = accountController.customer({});
*/
router.use(function(req,res,next){
    if(!req.session || typeof req.session.user == 'undefined'){
        res.redirect('/');
    }else{
        next();
    }
});
/*
router.get('/login',function(req,res){

    res.render('login',{
        pageTitle: "Log in",
        siteName: res.locals.siteTitle
    })
});
*/

/*
router.post('/loginSubmit', function(req,res){
    var username = req.body.username,
        password = req.body.password,
        Role = null;
    req.session.err = "";
    loginData.findOne({'username': username}, function(err,user){
       if(err) throw err("Error during login has occurred");
        if(user){
            crypt(password).verifyAgainst(user.hash,function(err,match){
                if(match){
                    if(user.role = "General_manager"){Role = generalManager}
                    if(user.role = "Assistant_manager"){Role = assistantManager}
                    if(user.role = "Receptionist"){Role = receptionist}

                    Role.findById(user.user_id, function(err, user){
                        if(err) throw err("Error during login has occurred");
                        if(user){
                            req.session.loggedIn = true;
                            req.session.name = user.name;
                            req.session.role = user.role;
                        }
                    })
                }
            })
        }else{
            res.render('login',{
                error: "Data provided does not match the database"
            });
        }
    });
});
*/
module.exports = router;