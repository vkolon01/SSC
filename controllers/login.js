var express = require('express'),
    router = express.Router();

router.use(function(req,res,next){
    if(req.session && typeof req.session.user !== 'undefined'){
        res.redirect('/home');
    }else{
        next();
    }
});

//Home page
router.get('/',function(req,res){

    res.render('login',{
        pageTitle: "Home",
        siteName: res.locals.siteTitle
    })

});

module.exports = router;