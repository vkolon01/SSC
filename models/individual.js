var mongoose = require('mongoose');

module.exports = function(paths){
    var Base = new mongoose.Schema({
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
        role: {
            type: String,
            default: "Not_provided"
        }
    });
    Base.add(paths);

    return Base;
};