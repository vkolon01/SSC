var express = require('express'),
    router = express.Router(),
    later = require('later'),
    async = require('async'),
    dataController = require('../../models/dataController'),
    Promise = require('promise'),
    schedule = require('./handlers/scheduler');
    moment  = require('moment');

router.post('/create_appointment',function(req,res){
    var start_time = moment(req.body.available_day + ' ' + req.body.available_time,"ddd DD/MM/YY HH:mm").add(1,'hour'),
        end_time = moment(start_time).add(req.body.time_slot,'minutes');
   var appointment = {
       dentist_id: req.body.dentist_id,
       customer_id: req.body.customer_id,
       start: start_time,
       end: end_time
    };

    dataController.check_availability(appointment.dentist_id,{start:start_time,end:end_time}).then(function(available){
        if(available){
            dataController.find_customer(req.body.customer_id).then(function(customer){
                dataController.find_dentist(req.body.dentist_id).then(function(dentist){
                    dataController.create_appointment({appointment:appointment,customer:customer,dentist:dentist}).then(function(result){
                        res.send({message:"The appointment is booked"});
                    },function(err){
                        console.log(err);
                    })
                });
            });
        }else{
            res.send({message:"Please choose a different time"})
        }
    },function(err){

    });

});

router.post('/delete_appointment',function(req,res){
    dataController.delete_appointment(req.body.id).then(function(appointment) {
        get_appointments(appointment.dentist_id).then(function(organised_list){
           res.status(200);
           res.render('./content/appointment_table',{
               appointment_list: organised_list
           })
       });
   });
});

router.post('/browse_appointments',function(req,res){
    get_appointments(req.body.id).then(function(organised_list){
        res.status(200);
        res.render('./content/appointment_table',{
            appointment_list: organised_list
        })
    });
});

router.post('/get_days',function(req,res){
    var dentist_id = req.body.dentist_id;
            var search_from = moment(),
                search_to = moment().add(1,'month'),
                from = search_from,
                days = [];

            while (search_from < search_to) {
                search_from.add(1,'day');
                days.push(from.format("ddd DD/MM/YY"));
                from = search_from;
                if (search_from >= search_to) {
                    res.status(200);
                    res.render('./content/get_days',{days: days});
                    res.end();
                }
            }
});

router.post('/get_times',function(req,res){
    var time_slot = req.body.time_slot,
        dentist_id = req.body.dentist_id,
        date = moment(req.body.date,"DD/MM/YY");
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
                        end = moment(start).add(time_slot,'minutes');
                    dataController.check_availability(dentist_id,{
                        start:start,
                        end:end
                    }).then(function(available){
                        if(available){
                            list.push(start.utc().format("hh:mm"));
                        }
                        search_from.add(15,'minutes'); //adjusts the time selection window.
                        collect();
                    },function(err){
                        console.log(err);
                        res.end();
                    });
                }
            }())
});

function get_appointments(id){
    return new Promise(function(fulfill,reject){
        dataController.get_appointments(id).then(function(list){
            if(list.length > 0){
                var organised_list = [];
                list.forEach(function(appointment) {
                    dataController.find_dentist(appointment.dentist_id).then(function(dentist) {
                        dataController.find_customer(appointment.customer_id).then(function(customer){
                            organised_list.push({
                                id: appointment._id,
                                date: moment(appointment.start).utc().format('DD/MM/YY'),
                                time: moment(appointment.start).utc().format('HH:mm'),
                                dentist: dentist,
                                customer: customer,
                                time_slot: moment(appointment.end - appointment.start).format('mm')
                            });
                            setTimeout(function(){
                                if(organised_list.length == list.length){fulfill(organised_list)}
                            },100)
                        });
                        setTimeout(function(){ //forces the return of the list after one second
                            fulfill(organised_list)
                        },1000);
                    });

                });
            }else{
                fulfill();
            }
        });
    });
}
exports.get_appointments = get_appointments;
module.exports = router;
