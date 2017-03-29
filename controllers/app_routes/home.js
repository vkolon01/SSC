var express = require('express'),
    router = express.Router();

router.use(function(req,res,next){
    if(!req.session || typeof req.session.user == 'undefined'){
        res.redirect('/login');
    }else{
        next();
    }
});

router.get('/',function(req,res){
    res.render('index',{
        pageTitle: "Index",
        siteName: res.locals.siteTitle,
        user: req.session.user,
        role: req.session.role
    })
});

router.get('/logOut',function(req,res){
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;