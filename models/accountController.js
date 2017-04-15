/**
 * Account controller passes mongoose models to the app.
 */

var staff_data = require('./staff_data'),
    customer_data = require('./customer_data'),
    dentist_data = require('./dentist_data');

exports.create_customer_account = function(form){return customer_data.create_account(form)};
exports.create_staff_account = function(form){return staff_data.create_account(form)};
exports.create_dentist_account = function(form){return dentist_data.create_account(form)};

exports.edit_customer_phone_number = function(phone_number,customer_id){return customer_data.edit_phone_number(phone_number,customer_id)};
exports.edit_dentist_phone_number = function(phone_number,id){return dentist_data.edit_phone_number(phone_number,id)};
exports.edit_customer_email = function(email,customer_id){return customer_data.edit_email(email,customer_id)};
exports.edit_dentist_email = function(email,id){return dentist_data.edit_email(email,id)};

exports.find_customer = function(id){return customer_data.find_account(id)};
exports.find_dentist = function(id){return dentist_data.find_account(id)};
exports.find_customer_by_email = function(customer_email){return customer_data.find_customer_by_email(customer_email)};
exports.get_all_customers = function(){return customer_data.get_all_accounts()};
exports.get_all_dentists = function(){return dentist_data.get_all_accounts()};

exports.login =function(form){return staff_data.login(form)};

exports.delete_dentist = function(id){return dentist_data.delete(id)};
exports.delete_customer = function(customer_id){return customer_data.delete_customer(customer_id)};