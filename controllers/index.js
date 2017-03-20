var express = require('express'),
    router = express.Router();

router.use('/home', require('./home'));
router.use('/users',require('./users'));

//Home page
router.get('/login',function(req,res){

  res.render('login',{
    pageTitle: "Home",
    siteName: res.locals.siteTitle
  })

});

module.exports = router;

/*
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
 */