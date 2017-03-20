var BaseSchema = require('../individual');

module.exports = function(paths){

    var StaffBaseSchema = new BaseSchema({
        monthly_wage_type: Boolean
    });

    StaffBaseSchema.add(paths);

    return StaffBaseSchema;
};