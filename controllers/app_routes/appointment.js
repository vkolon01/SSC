var express = require('express'),
    router = express.Router(),
    later = require('later'),
    accountController = require('../../models/accountController'),
    schedule = require('node-schedule'),
    moment  = require('moment');

var startTime = new Date(Date.now() + 5000);
var endTime = new Date(startTime.getTime() + 5000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
    console.log('Time for tea!');
});

router.post('/create_appointment',function(req,res){
    var start_time = moment(req.body.available_day + ' ' + req.body.available_time),
        end_time = moment(start_time).add(req.body.time_slot,'minutes');
   var appointment = {
       dentist_id: req.body.dentist_id,
       customer_id: req.body.customer_id,
       start_time: start_time,
       end_time: end_time
    };
    console.log(req.body);
    accountController.create_appointment(appointment).then(function(result){
        res.status(200);
        res.send("The appointment is booked");
    },function(err){
        console.log(err);
    })
});

router.post('/test',function(req,res){
    var data = req.body.info;
    var list = [1,2,3,4,5,6];
    console.log(data);

    res.status(200);
    res.render('list',{list:list});
    //res.send({list:list});
    res.end();
});

router.post('/get_days',function(req,res){
    var time_slot = req.body.time_slot,
        dentist_id = req.body.dentist_id;
    accountController.browse_appointments(dentist_id).then(function(appointments){
        accountController.find_dentist(dentist_id).then(function(dentist){
            var search_from = moment(),
                search_to = moment().add(1,'month'),
                from = search_from,
                days = [];

            while (search_from < search_to) {
                search_from.add(1,'day');
               // console.log("today is " + from.format("ddd DD/MM/YY"));
                days.push(from.format("ddd DD/MM/YY"));
                from = search_from;
                if (search_from >= search_to) {
                    res.status(200);
                    res.render('get_days',{days: days});
                    res.end();
                }
            }
        },function(err){
            console.log(err);
            res.end();
        })
    },function(err){
        console.log(err);
        res.end();
    })
});

router.post('/get_times',function(req,res){
    var time_slot = req.body.time_slot,
        dentist_id = req.body.dentist_id,
        date = moment(req.body.date,"DD/MM/YY"),
        today = moment("DD/MM/YY").format;
    accountController.browse_appointments(dentist_id).then(function(appointments){
        accountController.find_dentist(dentist_id).then(function(dentist){
            var search_from = moment(date),
                search_to = date.add(1,'d'),
                list = [];
            while (search_from < search_to) {
                var from = moment(search_from);
                var to = search_from.add(time_slot,'minutes');
                list.push(from.format("HH:mm"));
                if (search_from >= search_to) {
                    res.status(200);
                    res.render('list',{list: list});
                    res.end();
                }
            }
        },function(err){
            console.log(err);
            res.end();
        })
    },function(err){
        console.log(err);
        res.end();
    })
});



var create_list = function(range,timeslot){
    return new Promise(function(fulfill,reject) {
        console.log(timeslot);
        var search_from = moment(),
            search_to = moment();

        search_from = moment(search_from).add(1, 'd');
        search_to = moment(search_to).add(5, 'd');

        var list = [];
        while (search_from < search_to) {
            var from = search_from;
            var to = search_from.add(timeslot, 'm');

            list.push({
                from: from,
                to: to
            });
            console.log(from + " " + to);
            if (search_from > search_to) {
                fulfill(list);
            }
        }
    });
};

module.exports = router;
