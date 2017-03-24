/**
 * Account controller passes mongoose models to the app.
 */

var mongoose = require('mongoose'),
    staff_account = require('./staff_account');

exports.create_account = function(form){
   console.log(form);
   return staff_account.create_account(form);
};