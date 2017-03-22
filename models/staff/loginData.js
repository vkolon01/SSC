var mongoose = require('mongoose');

var loginDataSchema = new mongoose.Schema({
    username: String,
    hash: String,
    role: String,
    account_id: String
});
module.exports = function(){
    return mongoose.model('login_data', loginDataSchema);
};