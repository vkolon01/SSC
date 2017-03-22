var BaseSchema = require('./account_info');

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