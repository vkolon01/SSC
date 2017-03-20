var mongoose = require('mongoose');

module.exports = function(paths){
    var LoginData = new mongoose.Schema({
        username: String,
        hash: String,
        role: String,
        user_id: String
    });
    LoginData.add(paths);

    return LoginData;
};