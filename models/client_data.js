var Account_Info = require('./account_info').account_data(),
    email_handler = require('../controllers/app_routes/handlers/email_handler'),
    mongoose = require('mongoose'),
    Promise = require('promise'),
    shortid = require('shortid');

//mongoose schema for the client.
var Client_Schema = new mongoose.Schema({
        role: {
            type: String,
            default: "client"
        },
        _id:String,
        registration_date: Date,
        account_info: Account_Info,
        medicalHistory: [String]
    });

//client model connected to mongoose database.
var Client_Model = mongoose.model('client_account',Client_Schema);

//exported functions that are called by the accountController
exports.create_account = function(form){
    return new Promise(function(fulfill,reject){
        Client_Model.find({'account_info.email':form.email},function(err,result){
            if(result.length > 0){
                reject('The email is already in use');
            } else{
                var account = new Client_Model({
                    _id: shortid.generate(),
                    registration_date: new Date(),
                    account_info:{
                        name:form.name,
                        phone_number: form.phone_number,
                        date_of_birth: form.date_of_birth,
                        email: form.email,
                        gender:form.gender
                    }
                });
                account.save(function(err,account){
                    if(err)return reject(err);
                    email_handler.sendGreetingEmail(account);
                    fulfill(account);
                });
            }
        });
    })
};

exports.edit_phone_number = function(phone_number, client_id){
    return new Promise(function(fulfill,reject){
        Client_Model.findByIdAndUpdate(client_id,
            {$set:{'account_info.phone_number':phone_number}}
        ,function(err, account){
            email_handler.sendChangePhoneNumberNotification(account,phone_number);
            if(err) reject(err);
            fulfill('Update is successful');
        })
    });
};
exports.edit_email = function(email, client_id){
    return new Promise(function(fulfill,reject){
        Client_Model.find({'account_info.email':email},function(err,result){
           if(result.length > 0){
               reject('The email is already in use');
           } else{
               Client_Model.findByIdAndUpdate(client_id,
                   {$set:{'account_info.email':email}}
                   ,function(err, account){
                       if(err) reject(err);
                       email_handler.sendChangeEmailNotification(account,email);
                       fulfill('Update is successful');
                   }
               )
           }
        });

    });
};

exports.find_account = function(client_id){
    return new Promise(function(fulfill,reject){
        Client_Model.findById(client_id,function(err,client_data){
            if(err) reject('Client not found');
            if(client_data) {
                fulfill(client_data)
            }else{
                reject('Client not found');
            }
        })
    });
};

exports.find_client_by_email = function(email){
    return new Promise(function(fulfill,reject){
        Client_Model.findOne({
            'account_info.email':email
        },function(err,client_data){
            if(err) reject(err);
            if(client_data) {
                fulfill(client_data)
            }else{
                reject('Client not found');
            }
        })
    });
};

exports.get_all_accounts = function(){
    return new Promise(function(fulfill,reject){
        Client_Model.find(function(err,list){
            if(err) reject('Error has occurred');
            if(list) {
                fulfill(list)
            }else{
                reject('No client data is found')}
        })
    })
};
exports.delete_client = function(client_id){
    return new Promise(function(fulfill,reject){
        Client_Model.findOneAndRemove({'_id':client_id},function(err,removed_account){
            //Store deleted_account in a log file.
            fulfill(removed_account);
        })
    })
};