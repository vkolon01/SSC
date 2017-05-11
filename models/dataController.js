/**
 * Account controller passes mongoose models to the app.
 */

var staff_data = require('./staff_data'),
    client_data = require('./client_data'),
    dentist_data = require('./dentist_data'),
    settings_data = require('./settings_data'),
    appointment_data = require('./appointment_data');

//client_data
exports.edit_client_phone_number = function(phone_number,client_id){return client_data.edit_phone_number(phone_number,client_id)};
exports.create_client_account = function(form){return client_data.create_account(form)};
exports.find_client = function(id){return client_data.find_account(id)};
exports.find_client_by_email = function(client_email){return client_data.find_client_by_email(client_email)};
exports.get_all_clients = function(){return client_data.get_all_accounts()};
exports.edit_client_email = function(email,client_id){return client_data.edit_email(email,client_id)};
exports.delete_client = function(client_id){return client_data.delete_client(client_id)};

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
exports.find_dentist_by_email = function(email){return dentist_data.find_dentist_by_email(email)};
exports.get_all_dentists = function(){return dentist_data.get_all_accounts()};
exports.delete_dentist = function(id){return dentist_data.delete(id)};

//appointment_data
exports.create_appointment = function(data){return appointment_data.create_appointment(data)};
exports.check_availability = function(id,appointment){return appointment_data.check_availability(id,appointment)};
exports.get_appointments = function(id){return appointment_data.get_appointments(id)};
exports.delete_expired_appointment = function(time){return appointment_data.delete_expired_appointment(time)};
exports.delete_appointment = function(data){return appointment_data.delete_appointment(data)};

//settings
exports.create_settings_file = function(){return settings_data.create_settings_file()};
exports.update_business_working_hours = function(data){return settings_data.update_business_working_hours(data)};
exports.update_mail_delivery_time = function(time){return settings_data.update_mail_delivery_time(time)};
exports.get_business_working_hours = function(){return settings_data.get_working_hours()};
exports.get_mail_delivery_time = function(){return settings_data.get_mail_delivery_time()};