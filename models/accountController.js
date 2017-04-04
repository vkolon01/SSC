/**
 * Account controller passes mongoose models to the app.
 */

var staff_data = require('./staff_data'),
    customer_data = require('./customer_data');

exports.create_customer_account = function(form){return customer_data.create_account(form)};
exports.create_staff_account = function(form){return staff_data.create_account(form)};
exports.find_customer = function(customer_id){return customer_data.find_account(customer_id)};
exports.find_customer_by_email = function(customer_email){return customer_data.find_customer_by_email(customer_email)};
exports.login =function(form){return staff_data.login(form)};
exports.get_all_customers = function(){return customer_data.get_all_customers()};