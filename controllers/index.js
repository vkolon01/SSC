var express = require('express'),
    router = express.Router(),
    accessHandler = require('./app_routes/handlers/roles');

const DEFAULT_ROLE = 'guest';
router.use('*',function(req,res,next){
    if(typeof req.session !== 'undefined' && typeof req.session.role !== 'undefined' && accessHandler.roles.indexOf(req.session.role) !== -1){
        res.locals.userRole = req.session.role;
    }else{
        res.locals.userRole = DEFAULT_ROLE;
    }
    next();
});


router.use('/home', require('./app_routes/home'));
router.use('/users',require('./app_routes/users'));
router.use('/customers',require('./app_routes/customers'));
router.use('/dentist',require('./app_routes/dentist'));
router.use('/appointments',require('./app_routes/appointment'));

module.exports = router;