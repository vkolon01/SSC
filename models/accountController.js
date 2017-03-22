/**
 * Account controller passes mongoose models to the app.
 */

var mongoose = require('mongoose');

var models = [];
var GeneralManagerSchema = require('./staff/generalManager');
var AssistantManagerSchema = require('./staff/assistantManager');
var receptionist = require('./staff/reception');
var loginData = require('./staff/loginData');
var CustomerSchema = require('./customer');
models.push(loginData,receptionist);

/*module.exports = {
    generalManager: mongoose.model('general_manager', new GeneralManagerSchema({})),
    assistantManager: mongoose.model('assistant_manager', new AssistantManagerSchema({})),
    customer: mongoose.model('customer', new CustomerSchema({})),
    models: models,
    createReceptionist: function(name,phone_number,date_of_birth){
        var account = new receptionist({
            name: name,
            phone_number: phone_number,
            date_of_birth: date_of_birth
        });
        account.save(function(err,account){
            if(err) throw(err);
            return account._id;
        })
    }
};
    */
exports.createReceptionist = function(name,phone_number,date_of_birth){
    var account = new receptionist({
        name: name,
        phone_number: phone_number,
        date_of_birth: date_of_birth
    });
    account.save(function(err,account){
        if(err) throw(err);
        return account._id;
    })
};