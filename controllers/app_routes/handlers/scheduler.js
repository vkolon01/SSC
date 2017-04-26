var schedule = require('node-schedule'),
    dataController = require('../../../models/dataController'),
    moment = require('moment'),
    appointment_handler = require('../appointment');
    email_handler = require('./email_handler');


var rule = new schedule.RecurrenceRule();
rule.second = [30,0];

var j = schedule.scheduleJob(rule,function(){
    //send_appointment_notifications(new moment());
    get_all_clients_for_tomorrow(new moment());
});

var get_all_clients_for_tomorrow = function(today){
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
                        if(!sent){
                            sent = true;
                            email_handler.sendTomorrowAppointments(tomorrow_appointments,dentist);
                        }
                    },100)
                });
            });
        })
    })
};

//sending all the customers who have appointment tomorrow an email reminder
var send_appointment_notifications = function(today){
    var tomorrow = today.utc().clone().add(1,'days').startOf('day');
    dataController.get_appointments().then(function(appointments){
        appointments.forEach(function(appointment){
            if(tomorrow.isSame(moment(appointment.end).utc().startOf('day'))){
                dataController.find_customer(appointment.customer_id).then(function(customer){
                    dataController.find_dentist(appointment.dentist_id).then(function(dentist){
                        email_handler.sendUpcomingAppointmentNotification({
                            customer:customer,
                            dentist:dentist,
                            start: appointment
                        })
                    });
                })
            }
        })
    });
};

