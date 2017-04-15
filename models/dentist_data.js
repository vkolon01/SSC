var Account_Info = require('./account_info').account_data(),
    email_handler = require('../controllers/app_routes/handlers/email_handler'),
    mongoose = require('mongoose'),
    Promise = require('promise'),
    shortid = require('shortid');

//mongoose schema for the dentist account.
var Dentist_Schema = new mongoose.Schema({
    role: {
        type: String,
        default: "dentist"
    },
    _id:String,
    registration_date: Date,
    account_info: Account_Info
});

//dentist model connected to mongoose database.
var Dentist_Model = mongoose.model('dentist_account',Dentist_Schema);

//exported functions that are called by the accountController

exports.get_all_accounts = function(){
    return new Promise(function(fulfill,reject){
        Dentist_Model.find(function(err,list){
            if(err) reject('Error has occurred');
            if(list) {
                fulfill(list)
            }else{
                reject('No accounts data is found')}
        })
    })
};

exports.find_account = function(id){
    return new Promise(function(fulfill,reject){
        Dentist_Model.findById(id,function(err,data){
            if(err) reject('Account not found');
            if(data) {
                fulfill(data)
            }else{
                reject('Account not found');
            }
        })
    });
};

exports.create_account = function(form){

    return new Promise(function(fulfill,reject){
        Dentist_Model.find({'account_info.email':form.email},function(err,result){
            if(result.length > 0){
                reject('The email is already in use');
            } else{
                var account = new Dentist_Model({
                    _id: shortid.generate(),
                    registration_date: new Date(),
                    account_info:{
                        name:form.name,
                        phone_number: form.phone_number,
                        date_of_birth: form.date_of_birth,
                        email: form.email
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

exports.delete = function(id){
    return new Promise(function(fulfill,reject){
        Dentist_Model.findOneAndRemove({'_id':id},function(err,removed_account){
            //Store deleted_account in a log file.
            email_handler.sendRemovedAccountNotification(removed_account);
            fulfill('The account has been removed');
        })
    })
};
exports.edit_phone_number = function(phone_number, id){
    return new Promise(function(fulfill,reject){
        Dentist_Model.findByIdAndUpdate(id,
            {$set:{'account_info.phone_number':phone_number}}
            ,function(err, account){
                email_handler.sendChangePhoneNumberNotification(account,phone_number);
                if(err) reject(err);
                fulfill('Update is successful');
            })
    });
};
exports.edit_email = function(email, id){
    return new Promise(function(fulfill,reject){
        Dentist_Model.find({'account_info.email':email},function(err,result){
            if(result.length > 0){
                reject('The email is already in use');
            } else{
                Dentist_Model.findByIdAndUpdate(id,
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