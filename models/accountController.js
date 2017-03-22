/**
 * Account controller passes mongoose models to the app.
 */

var mongoose = require('mongoose'),
    staff_account = require('./staff_account');
exports.create_account = function(name,phone_number,date_of_birth,username,hash){
   return staff_account.create_account(name,phone_number,date_of_birth,username,hash,role);
};