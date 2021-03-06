var express = require('express'),
    router = express.Router(),
    later = require('later'),
    async = require('async'),
    dataController = require('../../models/dataController'),
    Promise = require('promise'),
    schedule = require('./handlers/scheduler'),
    email_handler = require('./handlers/email_handler'),
    moment  = require('moment'),
    accessHandler = require('./handlers/roles'),
    userRole;

router.use(function(req,res,next){
    userRole = res.locals.userRole;
    next();
});


router.post('/create_appointment',function(req,res){
    var permission = accessHandler.ac.can(userRole).createAny('appointment');
    if (permission.granted){
        var start_time = moment(req.body.available_day + ' ' + req.body.available_time,"ddd DD/MM/YY HH:mm").add(1,'hour'),
            end_time = moment(start_time).add(req.body.time_slot,'minutes');
        var appointment = {
            dentist_id: req.body.dentist_id,
            client_id: req.body.client_id,
            start: start_time,
            end: end_time
        };

        dataController.check_availability(appointment.dentist_id,{start:start_time,end:end_time}).then(function(available){
            if(available){
                dataController.find_client(appointment.client_id).then(function(client){
                    dataController.find_dentist(appointment.dentist_id).then(function(dentist){
                        dataController.create_appointment(appointment).then(function(success){
                            if(success){
                                email_handler.sendBookedAppointmentNotification({appointment:appointment,client:client,dentist:dentist});
                                res.send({
                                    message:"The appointment is now booked",
                                    booked:true
                                });
                            }
                        },function(err){
                            res.send({
                                error:err,
                                booked:false
                            })
                        })
                    });
                });
            }else{
                res.send({
                    message:"Please choose a different time",
                    booked:false
                })
            }
        },function(err){
            console.error(err);
        });
    }else{
        res.status(403).end();
    }


});

/*
Deletes the appointment by using the given id.
 */
router.post('/delete_appointment',function(req,res){
    var permission = accessHandler.ac.can(userRole).deleteAny('appointment');
    if (permission.granted){
        dataController.delete_appointment(req.body.id).then(function(appointment) {
            //send an cancellation email
            dataController.find_client(appointment.client_id).then(function(client){
                dataController.find_dentist(appointment.dentist_id).then(function(dentist){
                    email_handler.sendCanceledAppointmentNotification({client: client,dentist:dentist});
                });
            });

            //refresh the appointment table
            get_appointments(appointment.dentist_id).then(function(organised_list){
                res.status(200);
                res.render('./content/appointment_table',{
                    appointment_list: organised_list
                })
            });
        });
    }else{
        res.status(403).end();
    }

});

router.post('/browse_appointments',function(req,res){
    var permission = accessHandler.ac.can(userRole).readAny('appointment');
    if (permission.granted){
        get_appointments(req.body.id).then(function(organised_list){
            res.status(200);
            res.render('./content/appointment_table',{
                appointment_list: organised_list
            })
        });
    }else{
        res.status(403).end();
    }

});

/*
Returns all the days for the next month.
 */
router.post('/get_days',function(req,res){
    var permission = accessHandler.ac.can(userRole).createAny('appointment');
    if (permission.granted){
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
    }else{
        res.status(403).end();
    }

});

/*
The route determines and returns time_slots of the day are available.
 */
router.post('/get_times',function(req,res){
    var permission = accessHandler.ac.can(userRole).createAny('appointment');
    if (permission.granted){
        dataController.get_business_working_hours().then(function(working_days){
            const TIME_SLOT = 15; //minutes
            var time_slot = req.body.time_slot,
                dentist_id = req.body.dentist_id,
                date = moment(req.body.date,"DD/MM/YY"),
                search_from = moment(date).utc().add(1,'h'),
                search_to = date.add(1,'d').utc(),
                list = [],
                opening = moment(date).hour(working_days[date.weekday()].opening),
                closing = moment(date).hour(working_days[date.weekday()].closing);

            (function collect(){

                var start = moment(search_from).utc(),
                    end = moment(start).add(time_slot,'minutes').utc();

                if (search_from >= search_to) {
                    res.status(200);
                    res.render('./content/get_hours',{list: list});
                    res.end();
                }else{
                    if(start >=  opening && end <= closing ){ //Checking if the date is within business working hours.
                        dataController.check_availability(dentist_id,{start:start, end:end}).then(function(available){  // checking if the date overlaps with another appointment on the current dentist
                            if(available){
                                list.push(start.utc().format("HH:mm"));
                            }
                            search_from.add(TIME_SLOT,'minutes'); //adjusts the time selection window.
                            collect();
                        });
                    }else{
                        search_from.add(TIME_SLOT,'minutes'); //adjusts the time selection window.
                        collect();
                    }
                }
            }())
        });
    }else{
        res.status(403).end();
    }

});

/*
Accepts id of either customer or dentist.
Returns an array list of all the appointments that involves the account with that id.
The list is sorted with the help of the sort function.
 */
function get_appointments(id){
    return new Promise(function(fulfill,reject){
        dataController.get_appointments(id).then(function(list){
            if(list.length > 0){
                var organised_list = [];
                list.forEach(function(appointment) {
                    dataController.find_dentist(appointment.dentist_id).then(function(dentist) {
                        dataController.find_client(appointment.client_id).then(function(client){
                            organised_list.push({
                                id: appointment._id,
                                date: moment(appointment.start).utc().format('DD/MM/YY'),
                                time: moment(appointment.start).utc().format('HH:mm'),
                                dentist: dentist,
                                client: client,
                                time_slot: moment(appointment.end - appointment.start).format('H:mm')
                            });
                            setTimeout(function(){
                                if(organised_list.length == list.length){fulfill(sort(organised_list))}
                            },100)
                        });
                        setTimeout(function(){ //forces the return of the list after one second
                            fulfill(sort(organised_list));
                        },1000);
                    });

                });
            }else{
                fulfill();
            }
        });
    });
}

/*
Sorts the given array list.
 */
function sort(list){
    var temp;
    for(var i = 0; i < list.length; i++){
        for(var y = 1; y < list.length; y++){
            var curDate1 = moment(list[y].date + ' ' + list[y].time,'DD/MM/YY HH:mm').format();
            var curDate2 = moment(list[y-1].date + ' ' + list[y-1].time,'DD/MM/YY HH:mm').format();
            if(curDate1 < curDate2){
                temp = list[y];
                list[y] = list[y-1];
                list[y-1] = temp;
            }
        }
        if(i == list.length -1){
           return list;
        }
    }
}

exports.get_appointments = get_appointments;
module.exports = router;
