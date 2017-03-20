var express = require('express'),
    router = express.Router();

router.use('/home', require('./home'));
router.use('/users',require('./users'));

//Home page
router.get('/',function(req,res){

  var accountController = require('../models/accountController');

  var generalManager = new accountController.generalManager({});
  var assistantManager = new accountController.assistantManager({});
  var receptionist = new accountController.receptionist({});
  var customer = new accountController.customer({});


  generalManager.save(function(err){
    console.log('receptionist is saved');
  });
  assistantManager.save(function(err){
    console.log('receptionist is saved');
  });
  receptionist.save(function(err){
    console.log('receptionist is saved');
  });
  customer.save(function(err){
    console.log('receptionist is saved');
  });


  res.render('index',{
    pageTitle: "Home",
    siteName: res.locals.siteTitle
  })
});

module.exports = router;
