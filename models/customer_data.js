var Account_Info = require('./account_info').account_data(),
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
        account.save(function(err,data){
            if(err)return reject(err);
            fulfill(data);
        })
    })
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