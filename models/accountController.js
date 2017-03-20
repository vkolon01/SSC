/**
 * Account controller passes mongoose models to the app.
 */

var mongoose = require('mongoose');

var GMSchema = require('./staff/generalManager');
var AssistantManagerSchema = require('./staff/assistantManager');
var ReceptionSchema = require('./staff/reception');
var LoginData = require('./staff/reception');
var CustomerSchema = require('./customer');

module.exports = {
    generalManager: mongoose.model('general_manager', new GMSchema({})),
    assistantManager: mongoose.model('assistant_manager', new AssistantManagerSchema({})),
    receptionist: mongoose.model('receptionist', new ReceptionSchema({})),
    loginData: mongoose.model('login_data', new LoginData({})),
    customer: mongoose.model('customer', new CustomerSchema({}))
};