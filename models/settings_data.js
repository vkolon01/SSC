var mongoose = require('mongoose'),
    Promise = require('promise'),
    moment = require('moment'),
    //scheduler = require('../controllers/app_routes/handlers/scheduler'),
    email_handler = require('../controllers/app_routes/handlers/email_handler');

var working_days = [];

for(var i = 0; i < 7; i++){
    working_days.push({day:i,opening:0,closing:0});
}

var Settings_Schema = new mongoose.Schema({
    working_days:{
        type:[],
        default: working_days
    },
    mail_delivery_time:{
        type: Number,
        default: 0
    }
});

var Settings_Model = mongoose.model('settings',Settings_Schema);

exports.create_settings_file = function(){
    return new Promise(function (fulfill,reject) {
        Settings_Model.find(function(err,settings){
            if(settings.length == 0){
                var file = new Settings_Model({

                });
                file.save(function(err,file){
                    if(err)reject();
                    if(file)fulfill;
                })
            }else{
                reject();
            }
        })
    });
};

exports.get_mail_delivery_time = function(){
   return new Promise(function(fulfill,reject){
       Settings_Model.findOne({},function(err,list){
           if(list){
               fulfill(list.mail_delivery_time);
           }else{
               reject(err);
           }
       })
   });
};

exports.get_working_hours = function(){
    return new Promise(function(fulfill,reject){
        Settings_Model.findOne({},function(err,list){
            if(list){
                fulfill(list.working_days);
            }else{
                reject('error');
            }
        })
    })
};

exports.update_business_working_hours = function(data){
   return new Promise(function(fulfill,reject){
       var opening = parseInt(data.hours.opening),
           closing = parseInt(data.hours.closing),
           day = moment().isoWeekday(data.day.substring(1)).weekday();
       if(closing >= opening){
           Settings_Model.findOneAndUpdate({"working_days.day":day},
               {$set:{"working_days.$.opening":opening,"working_days.$.closing":closing}},function(err,settings){
                   fulfill(settings)
               });
       }else{
           reject(false)
       }
   })
};

exports.update_mail_delivery_time = function(time){
   return new Promise(function(fulfill,reject){
       Settings_Model.findOneAndUpdate({},{mail_delivery_time:time},function(err,settings){
           //scheduler.change_notification_time(time);
           fulfill(settings);
       })
   })
};


