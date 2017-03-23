var mongoose = require('mongoose'),
    Account_Info = require('./account_info').account_data();

var Account_Schema = new mongoose.Schema({
    username: String,
    hash: String,
    role:{
        type: String,
        default: "not provided"
    },
    account_info:[Account_Info]
});
Account_Model = mongoose.model('login_data', Account_Schema);

exports.create_account = function(form){

    var account = new Account_Model({
        name: form.name,
        username: form.username,
        hash: form.hash,
        phone_number: form.phone_number,
        date_of_birth: form.date_of_birth,
        role: form.role
    });
    account.save(function(err){
        if(err) throw(err);
        return account._id;
    })
};