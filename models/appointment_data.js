var mongoose = require('mongoose'),
    Promise = require('promise'),
    email_handler = require('../controllers/app_routes/handlers/email_handler');

var Appointment_Schema = new mongoose.Schema({
    dentist_id:String,
    customer_id:String,
    start:Date,
    end:Date
});

//dentist model connected to mongoose database.
var Appointment_Model = mongoose.model('Appointment',Appointment_Schema);

exports.create_appointment = function(data){
    return new Promise(function(reject,fulfill){
        var new_appointment = new Appointment_Model({
            dentist_id: data.appointment.dentist_id,
            customer_id: data.appointment.customer_id,
            start: data.appointment.start,
            end: data.appointment.end
        });
        new_appointment.save(function(err,appointment){
            if(err)reject(err);
            email_handler.sendBookedAppointmentNotification(data);
            fulfill(appointment);
        });
    });
};

exports.delete_appointment = function(id){
    return new Promise(function(fulfill,reject){
        Appointment_Model.findOneAndRemove({_id:id},function(err,appointment){
            if(err)reject(err);
            fulfill(appointment);
        })
    });
};



exports.get_appointments = function(id){
  return new Promise(function(fulfill,reject){
      Appointment_Model.find({$or:[{dentist_id:id},{customer_id:id}]},function(err,list){
          if(err)reject (err);
              fulfill(list)
      })
  })
};

exports.get_all_appointments = function(){
    return new Promise(function(fulfill,reject){
        Appointment_Model.find(function(err,list){
            if(err)reject (err);
            fulfill(list)
        })
    })
};
exports.check_availability = function(id, new_appointment){
    return new Promise(function(fulfill,reject){
        Appointment_Model.find({dentist_id:id},function(err,booked_appointments){
            if(err) reject(err);
            if(booked_appointments.length > 0){
                var counter = 0;
                booked_appointments.forEach(function(appointment){
                    if(new_appointment.start.valueOf() < appointment.end.getTime() && new_appointment.end.valueOf() > appointment.start.getTime()){
                        fulfill(false);
                    }
                    counter++;
                    if(counter === booked_appointments.length){
                        fulfill(true);
                    }
                });
            }else{
                fulfill(true);
            }
        })
    });
};
