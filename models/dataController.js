/**
 * Account controller passes mongoose models to the app.
 */

var staff_data = require('./staff_data'),
    customer_data = require('./customer_data'),
    dentist_data = require('./dentist_data'),
    settings_data = require('./settings_data'),
    appointment_data = require('./appointment_data');

//customer_data
exports.edit_customer_phone_number = function(phone_number,customer_id){return customer_data.edit_phone_number(phone_number,customer_id)};
exports.create_customer_account = function(form){return customer_data.create_account(form)};
exports.find_customer = function(id){return customer_data.find_account(id)};
exports.find_customer_by_email = function(customer_email){return customer_data.find_customer_by_email(customer_email)};
exports.get_all_customers = function(){return customer_data.get_all_accounts()};
exports.edit_customer_email = function(email,customer_id){return customer_data.edit_email(email,customer_id)};
exports.delete_customer = function(customer_id){return customer_data.delete_customer(customer_id)};

//staff_data
exports.delete_by_username = function(username){return staff_data.delete_by_username(username)};
exports.create_staff_account = function(form){return staff_data.create_account(form)};
exports.login =function(form){return staff_data.login(form)};
exports.check_username_availability = function(username){return staff_data.check_username_availability(username)};
exports.check_staff_email_availability = function(email){return staff_data.check_email_availability(email)};

//dentist_data
exports.create_dentist_account = function(form){return dentist_data.create_account(form)};
exports.edit_dentist_phone_number = function(phone_number,id){return dentist_data.edit_phone_number(phone_number,id)};
exports.edit_dentist_email = function(email,id){return dentist_data.edit_email(email,id)};
exports.find_dentist = function(id){return dentist_data.find_account(id)};
exports.get_all_dentists = function(){return dentist_data.get_all_accounts()};
exports.delete_dentist = function(id){return dentist_data.delete(id)};

//appointment_data
exports.create_appointment = function(data){return appointment_data.create_appointment(data)};
exports.check_availability = function(id,appointment){return appointment_data.check_availability(id,appointment)};
exports.get_appointments = function(id){return appointment_data.get_appointments(id)};
//exports.get_appointments = function(){return appointment_data.get_appointments()};
exports.delete_appointment = function(data){return appointment_data.delete_appointment(data)};

//settings
exports.create_settings_file = function(){return settings_data.create_settings_file()};
exports.update_business_working_hours = function(data){return settings_data.update_working_hours(data)};
exports.get_business_working_hours =function(){return settings_data.get_working_hours()};