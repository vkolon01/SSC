var mongoose = require('mongoose'),
    Promise = require('promise'),
    email_handler = require('../controllers/app_routes/handlers/email_handler');

var Appointment_Schema = new mongoose.Schema({
    dentist_id:String,
    client_id:String,
    start:Date,
    end:Date
});

//dentist model connected to mongoose database.
var Appointment_Model = mongoose.model('Appointment',Appointment_Schema);

exports.create_appointment = function(appointment){
    return new Promise(function(fulfill,reject){
        var new_appointment = new Appointment_Model({
            dentist_id: appointment.dentist_id,
            client_id: appointment.client_id,
            start: appointment.start,
            end: appointment.end
        });
        new_appointment.save(function(err,appointment){
            if(err)reject(err);
            fulfill(true);
        });
    });
};

/*
seeks and deletes appointments by the given id
 */
exports.delete_appointment = function(id){
    return new Promise(function(fulfill,reject){
        Appointment_Model.findOneAndRemove({_id:id},function(err,appointment){
            if(err)reject(err);
            fulfill(appointment);
        })
    });
};

//deletes all the appointments before the given time
exports.delete_expired_appointment = function(time){
    return new Promise(function(fulfill,reject){
        Appointment_Model.find({"end":{$lte:time}},function(err,list){
            if(err)reject(err);
            fulfill(list);
            list.forEach(function(appointment){
                appointment.remove();
            });

        });
    });
};

exports.get_appointments = function(id){
  return new Promise(function(fulfill,reject){
      Appointment_Model.find({$or:[{dentist_id:id},{client_id:id}]},function(err,list){
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
