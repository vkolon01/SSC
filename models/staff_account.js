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
exports.create_account = function(name,phone_number,date_of_birth,username,hash){
    var account = new Staff_Model({
        name: name,
        username: username,
        hash: hash,
        phone_number: phone_number,
        date_of_birth: date_of_birth
    });
    account.save(function(err){
        if(err) throw(err);
        return account._id;
    })
};