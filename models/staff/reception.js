var StaffBaseSchema = require('./staffBase'),
    mongoose = require('mongoose');


module.exports = function(paths){

    var ReceptionSchema = new StaffBaseSchema({
        total_working_hours:{
            type: Number,
            default: 0
        },
        role:{
            type: String,
            default: "Receptionist"
        }
    });

    ReceptionSchema.add(paths);
     return mongoose.model('receptionist',ReceptionSchema);
};