var express = require('express'),
    router = express.Router(),
    later = require('later'),
    accountController = require('../../models/accountController'),
    schedule = require('node-schedule'),
    Promise = require('promise');
    moment  = require('moment');

var startTime = new Date(Date.now() + 5000);
var endTime = new Date(startTime.getTime() + 5000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
    console.log('Time for tea!');
});

router.post('/create_appointment',function(req,res){
    var start_time = moment(req.body.available_day + ' ' + req.body.available_time,"ddd DD/MM/YY HH:mm").add(1,'hour'),
        end_time = moment(start_time).add(req.body.time_slot,'minutes');
   var appointment = {
       dentist_id: req.body.dentist_id,
       customer_id: req.body.customer_id,
       start: start_time,
       end: end_time
    };
    accountController.find_customer(req.body.customer_id).then(function(customer){
        accountController.find_dentist(req.body.dentist_id).then(function(dentist){
            accountController.create_appointment({appointment:appointment,customer:customer,dentist:dentist}).then(function(result){
                res.status(200);
                res.send({message:"The appointment is booked"});
            },function(err){
                console.log(err);
            })
        });
    });
});

router.post('/delete_appointment',function(req,res){
   accountController.delete_appointment(req.body.id).then(function(appointment) {
       generate_table(appointment.dentist_id).then(function(organised_list){
           res.status(200);
           res.render('./content/appointment_table',{
               appointment_list: organised_list
           })
       });
   });
});

router.post('/browse_appointments',function(req,res){
    generate_table(req.body.id).then(function(organised_list){
        res.status(200);
        res.render('./content/appointment_table',{
            appointment_list: organised_list
        })
    });
});

router.post('/get_days',function(req,res){
    var time_slot = req.body.time_slot,
        dentist_id = req.body.dentist_id;
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
                    res.render('./content/get_days',{days: days});
                    res.end();
                }
            }
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
        accountController.find_dentist(dentist_id).then(function(dentist){
            var search_from = moment(date),
                search_to = date.add(1,'d'),
                list = [];
            (function collect(){
                if (search_from >= search_to) {
                    res.status(200);
                    res.render('./content/get_hours',{list: list});
                    res.end();
                }else{
                    var start = moment(search_from),
                        end = start.add(time_slot,'minutes');
                    accountController.check_availability(dentist_id,{
                        start:start,
                        end:end
                    }).then(function(new_appointment){
                        if(new_appointment){
                            list.push(new_appointment.start.format("HH:mm"));
                        }
                        search_from.add(15,'minutes'); //adjusts the time selection window.
                        collect();
                    },function(err){
                        console.log(err);
                        res.end();
                    });
                }
            }())

        },function(err){
            console.log(err);
            res.end();
        })
});

function generate_table(id){
    return new Promise(function(fulfill,reject){
        accountController.get_appointments(id).then(function(list){
            if(list){
                var organised_list = [],
                    counter = 0;
                list.forEach(function(appointment) {
                    accountController.find_customer(appointment.customer_id).then(function (customer) {
                        organised_list.push({
                            id: appointment._id,
                            date: moment(appointment.start).format('DD/MM/YY'),
                            time: moment(appointment.start).format('HH:mm'),
                            customer: customer,
                            time_slot: moment(appointment.end - appointment.start).format('mm')
                        });
                        counter++;
                        if (counter == list.length) {
                            fulfill(organised_list);
                        }
                    });
                });
            }
        });
    });
}
module.exports = router;
