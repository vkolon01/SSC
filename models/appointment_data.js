var mongoose = require('mongoose'),
    Promise = require('promise');

var Appointment_Schema = new mongoose.Schema({
    dentist_id:String,
    customer_id:String,
    start_time:Date,
    end_time:Date
});

//dentist model connected to mongoose database.
var Appointment_Model = mongoose.model('Appointment',Appointment_Schema);

exports.create_appointment = function(data){
    return new Promise(function(reject,fulfill){
        var appointment = new Appointment_Model({
            dentist_id: data.dentist_id,
            customer_id: data.customer_id,
            start_time: data.start_time,
            end_time: data.end_time
        });
        appointment.save(function(err,appointment){
            if(err)reject(err);
            fulfill(appointment);
        });
    });
};
exports.browse_appointments = function(id){
  return new Promise(function(fulfill,reject){
      Appointment_Model.find({dentist_id:id},function(err,list){
          if(err)reject (err);
              fulfill(list)
      })
  })
};