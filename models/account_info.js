var mongoose = require('mongoose');

var Account_Info = new mongoose.Schema({
    name: {
        type: String,
        default: "Not_provided"
    },
    date_of_birth:{
        type: Date,
        default: null
    } ,
    phone_number:{
        type: String,
        default: "Not_provided"
    } ,
    email: {
        type: String,
        default: null
    },
});

exports.account_data = function(){
    return Account_Info;
};