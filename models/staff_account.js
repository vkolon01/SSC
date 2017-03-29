var mongoose = require('mongoose'),
    Promise = require('promise'),
    crypt = require('password-hash-and-salt'),
    Account_Info = require('./account_info').account_data();

var Account_Schema = new mongoose.Schema({
    username: String,
    hash: String,
    role:{
        type: String,
        default: "not provided"
    },
    account_info: Account_Info
});
Account_Model = mongoose.model('login_data', Account_Schema);

exports.create_account = function(form){
    return new Promise(function(fulfill,reject){
        var account = new Account_Model({
            username: form.username,
            hash: form.hash,
            role: form.role,
            account_info:{
                name: form.name,
                phone_number: form.phone_number,
                date_of_birth: form.date_of_birth,
                email: form.email
            }
        });
        account.save(function(err){
            if(err) return reject(err);
            fulfill(console.log('Account have been saved'));
        })
    });
};

exports.login = function(form){
    return new Promise(function(fulfill,reject){
        Account_Model.findOne({'username':form.username},function(err,user){
            if(err) console.error(err);
            if(user){
                crypt(form.password).verifyAgainst(user.hash, function(err,match){
                    if(err) console.error(err);
                    if(match){
                        fulfill(user)
                    }else{
                        reject(['User data provided does not match the database'])
                    }
                })
            }else{
                reject(['User data provided does not match the database'])
            }
        })
    });

};