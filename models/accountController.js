/**
 * Account controller passes mongoose models to the app.
 */

var staff_account = require('./staff_account');

exports.create_account = function(form){return staff_account.create_account(form)};
exports.login =function(form){return staff_account.login(form)};