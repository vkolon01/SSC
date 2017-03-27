var express = require('express'),
    router = express.Router();

router.use('/home', require('./app_routes/home'));
router.use('/users',require('./app_routes/users'));


module.exports = router;