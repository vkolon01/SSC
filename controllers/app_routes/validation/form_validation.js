var express = require('express'),
    validator = require('validator'),
    Promise = require('promise'),
    crypt = require('password-hash-and-salt'),
    async = require('async'),
    moment = require('moment');
exports.validate_customer_form = function(form) {
    var errors = [];
    return new Promise(function (fulfill, reject) {
        const MIN_CUSTOMER_AGE = 5;
        var nameOptions = {min: 3, max: 50};
        if (!validator.isAlpha(form.name.replace(' ', ''))) {
            errors.push('Please enter a valid name');
        }
        if (!validator.isLength(form.name, nameOptions)) {
            errors.push('The name must be between 3 and 50 characters.')
        }
        if (validator.isEmpty(form.email) || !validator.isEmail(form.email)) {
            errors.push('Enter a valid email address.');
        }
        if(moment(moment(form.date_of_birth).format("YYYY"),"YYYY").fromNow() < MIN_CUSTOMER_AGE){  //Does not work
            errors.push('The customer is too young');
        }
        if (errors.length > 0)return reject(errors);
        fulfill(form);
        console.log(form.date_of_birth.toISOString() - new Date().toISOString());
    });
};

exports.validate_staff_form = function(form){
    var errors = [];
    return new Promise(function (fulfill,reject){
        var usernameOptions = {min:5,max:20};
        var nameOptions = {min:3,max:50};
        //sanitize process...

        async.parallel([
            function(callback){
                if(validator.matches(form.password,form.password_confirm)) {
                    crypt(form.password).hash(function (err, hashed_password) {
                        if (err) reject(err);
                        form.hash = hashed_password;
                        callback();
                    });
                }else{
                    errors.push('The confirmation password does not match');
                }
            },
            function(callback){
                if(!validator.isAlpha(form.name.replace(' ',''))){errors.push('Please enter a valid name')}
                if(!validator.isLength(form.name,nameOptions)){errors.push('The name must be between 3 and 50 characters.')}
                if(validator.isEmpty(form.email) || !validator.isEmail(form.email)){errors.push('Enter a valid email address.')}if(validator.isEmpty(form.username) || !validator.isLength(form.username,usernameOptions)){errors.push('The username must be between 5 and 20 characters.')}
                if(!validator.isAlphanumeric(form.username)){errors.push('The username can only contain alphanumerical characters only')}
                callback();
            }
        ],
            function(err){
                if(errors.length > 0) return reject(errors);
                fulfill(form);
            }
        );
        //if(!validator.isMobilePhone(form.phone_number,"en-GB")){errors.push('Please enter a valid UK phone number.')}
    });
};