var mongoose = require('mongoose');

module.exports = function(paths){
    var loginDataSchema = new mongoose.Schema({
        username: String,
        hash: String,
        role: String,
        user_id: String
    });
    loginDataSchema.add(paths);

    return loginDataSchema;
};