/**
 * Account controller passes mongoose models to the app.
 */

var mongoose = require('mongoose');

var GMSchema = require('./staff/generalManager');
var assistantManagerSchema = require('./staff/assistantManager');
var receptionSchema = require('./staff/reception');
var customerSchema = require('./customer');

module.exports = {
    generalManager: mongoose.model('general_manager', new GMSchema({})),
    assistantManager: mongoose.model('assistant_manager', new assistantManagerSchema({})),
    receptionist: mongoose.model('receptionist', new receptionSchema({})),
    customer: mongoose.model('customer', new customerSchema({}))
};