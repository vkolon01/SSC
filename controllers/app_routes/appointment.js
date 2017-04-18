var express = require('express'),
    router = express.Router(),
    later = require('later'),
    accountController = require('../../models/accountController'),
    schedule = require('node-schedule');

var startTime = new Date(Date.now() + 5000);
var endTime = new Date(startTime.getTime() + 5000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
    console.log('Time for tea!');
});

router.post('/get_availability',function(req,res){
    var timeslot = req.body.time_slot,
        dentist_id = req.body.dentist_id;
    accountController.browse_appointments(dentist_id).then(function(list){
        accountController.get_constraints(dentist_id).then(function(dentist_constraints){
            var search_from = new Date(),
                search_to = new Date();
            search_from.setDate(search_from.getDate() + 1);
            search_to.setMonth(search_to.getMonth() + 1);
            console.log(search_from);
            res.redirect('/')
        },function(err){
            console.log(err);
            redirect('/');
        })
    },function(err){

        console.log('Search from ' + search_from + ' to ' + search_to);
        console.log(err);
        res.redirect('/');
    })
});

module.exports = router;
