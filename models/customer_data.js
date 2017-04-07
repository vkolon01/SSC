var Account_Info = require('./account_info').account_data(),
    email_handler = require('../controllers/app_routes/handlers/email_handler');
    mongoose = require('mongoose'),
    Promise = require('promise'),
    crypt = require('password-hash-and-salt'),
    shortid = require('shortid');

//mongoose schema for the customer.
var Customer_Schema = new mongoose.Schema({
        role: {
            type: String,
            default: "Customer"
        },
        _id:String,
        registration_date: Date,
        account_info: Account_Info
    });

//customer model connected to mongoose database.
var Customer_Model = mongoose.model('customer_account',Customer_Schema);

//exported functions that are called by the accountController
exports.create_account = function(form){
    console.log(shortid.generate());
    return new Promise(function(fulfill,reject){

        Customer_Model.find({'account_info.email':form.email},function(err,result){
            if(result.length > 0){
                reject('The email is already in use');
            } else{
                var account = new Customer_Model({
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
exports.edit_phone_number = function(phone_number, customer_id){
    return new Promise(function(fulfill,reject){
        Customer_Model.findByIdAndUpdate(customer_id,
            {$set:{'account_info.phone_number':phone_number}}
        ,function(err, account){
            email_handler.sendChangePhoneNumberNotification(account,phone_number);
            if(err) reject(err);
            fulfill('Update is successful');
        })
    });
};
exports.edit_email = function(email, customer_id){
    return new Promise(function(fulfill,reject){
        Customer_Model.find({'account_info.email':email},function(err,result){
           if(result.length > 0){
               reject('The email is already in use');
           } else{
               Customer_Model.findByIdAndUpdate(customer_id,
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

exports.find_account = function(customer_id){
    return new Promise(function(fulfill,reject){
        Customer_Model.findById(customer_id,function(err,customer_data){
            if(err) reject('Customer not found');
            if(customer_data) {
                fulfill(customer_data)
            }else{
                reject('Customer not found');
            }
        })
    });
};

exports.find_customer_by_email = function(email){
    return new Promise(function(fulfill,reject){
            Customer_Model.find(function(err,list){
                if(err) reject('Error has occurred');
                if(list) {
                    list.find
                }else{
                    reject('No customer data is found')}
            })
        Customer_Model.findOne({
            account_info:{email:email}
        },function(err,customer_data){
            if(err) reject('Customer not found');
            console.log(customer_data);
            if(customer_data) {
                fulfill(customer_data)
            }else{
                reject('Customer not found');
            }
        })
    });
};

exports.get_all_customers = function(){
    return new Promise(function(fulfill,reject){
        Customer_Model.find(function(err,list){
            if(err) reject('Error has occurred');
            if(list) {
                fulfill(list)
            }else{
                reject('No customer data is found')}
        })
    })
};

exports.delete_customer = function(customer_id){
    return new Promise(function(fulfill,reject){
        Customer_Model.findOneAndRemove({'_id':customer_id},function(err,removed_account){
            //Store deleted_account in a log file.
            email_handler.sendRemovedAccountNotification(removed_account);
            fulfill('The account has been removed');
        })
    })
}