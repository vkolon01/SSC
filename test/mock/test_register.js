var form_validation = require('../../controllers/app_routes/handlers/form_validation'),
    dataController = require('../../models/dataController'),
    Promise = require('promise');

exports.register = function(form){
    return new Promise(function(fulfill,reject){
        form_validation.validate_staff_form(form).then(function(form){dataController.create_staff_account(form).then(function(data){
            fulfill(true);
        },function(err){// Account creation error handling
            reject(err);
        });
        },function(err){ // Form handlers error handling
            reject(err)
        });
    });
};