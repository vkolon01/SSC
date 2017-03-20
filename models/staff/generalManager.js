var assistantManagerSchema = require('./assistantManager');

module.exports = function(paths){

     var GMSchema = new assistantManagerSchema({
         role:{
             type: String,
             default: "General_Manager"
         }
     });

    GMSchema.add(paths);

     return GMSchema;
};
