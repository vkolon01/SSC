var schedule = require('node-schedule'),
    dataController = require('../../../models/dataController'),
    moment = require('moment'),
    appointment_handler = require('../appointment'),
    email_handler = require('./email_handler');
const TIME_SLOT = [0,15,30,45]; //minutes

var notifier = new schedule.RecurrenceRule(),
    eliminator = new schedule.RecurrenceRule();

eliminator.second = TIME_SLOT;

/*
Sends notifications at the set delivery time.
 */
dataController.get_mail_delivery_time().then(function(time){
    set_notifier_time(time);
    var j = schedule.scheduleJob(notifier,function(){
        send_reminder(new moment());
        send_schedule(new moment());
        dataController.create_settings_file();
    });
});

/*
deletes all the expired appointments.
 */
schedule.scheduleJob(eliminator,function(){
    dataController.delete_expired_appointment(new moment()).then(function(list){
        //The list contains deleted appointments. Can be used for logging.
        //console.log(list);
    },function(err){
        console.log(err);
    })
});

var set_notifier_time = function(time){
    notifier.hour = time;
};

var send_schedule = function(today){
    var tomorrow = today.utc().clone().add(1,'days').startOf('day');
    dataController.get_all_dentists().then(function(dentists){
        dentists.forEach(function(dentist){
            var tomorrow_appointments = [];
            var sent = false;
            appointment_handler.get_appointments(dentist.id).then(function(list){
                list.forEach(function(appointment){
                    if(tomorrow.format('DD/MM/YY') == moment(appointment.date,'DD/MM/YY').startOf('day').format('DD/MM/YY')){
                        tomorrow_appointments.push(appointment);
                    }
                    setTimeout(function () {
                        if(!sent && tomorrow_appointments.length > 0){
                            sent = true;
                            email_handler.sendTomorrowAppointments(tomorrow_appointments,dentist);
                        }
                    },100)
                });
            });
        })
    })
};

//sending all the clients who have appointment tomorrow an email reminder
var send_reminder = function(today){
    var tomorrow = today.utc().clone().add(1,'days').startOf('day');
    dataController.get_appointments().then(function(appointments){
        appointments.forEach(function(appointment){
            if(tomorrow.isSame(moment(appointment.end).utc().startOf('day'))){
                dataController.find_client(appointment.client_id).then(function(client){
                    dataController.find_dentist(appointment.dentist_id).then(function(dentist){
                        email_handler.send_reminder({
                            client:client,
                            dentist:dentist,
                            start: appointment
                        })
                    });
                })
            }
        })
    });
};

//To be used as a gateway for changing the notification schedule
exports.change_notification_time = function(time){set_notifier_time(time)};