var BaseSchema = require('./individual');

module.exports = function(paths){

    var customerSchema = new BaseSchema({
        role: {
            type: String,
            default: "Customer"
        }
    });

    customerSchema.add(paths);

    return customerSchema;
};