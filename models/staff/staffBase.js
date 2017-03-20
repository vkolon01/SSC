var BaseSchema = require('../individual');

module.exports = function(paths){

    var StaffBaseSchema = new BaseSchema({
        monthly_wage_type: Boolean,
        username: String,
        hash: String
    });

    StaffBaseSchema.add(paths);

    return StaffBaseSchema;
};