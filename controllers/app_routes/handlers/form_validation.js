var express = require('express'),
    validator = require('validator'),
    Promise = require('promise'),
    crypt = require('password-hash-and-salt'),
    async = require('async'),
    moment = require('moment'),
    dataController = require('../../../models/dataController');


const   MIN_PASSWORD_LENGTH = 8,
        MIN_DENTIST_AGE = 18,
        MIN_NAME_LENGTH = 3,
        MAX_NAME_LENGTH = 50,
        MIN_CLIENT_AGE = 5;
exports.validate_dentist_form = function(form){
    return new Promise(function (fulfill, reject) {

        var nameOptions = {min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH},
            errors = [];

        if (!validator.isAlpha(form.name.replace(' ', ''))) {
            errors.push('Please enter a valid name');
        }
        if (!validator.isLength(form.name, nameOptions)) {
            errors.push('The name must be between 3 and 50 characters.')
        }
        if (validator.isEmpty(form.email) || !validator.isEmail(form.email)) {
            errors.push('Enter a valid email address.');
        }
        if(moment(moment(form.date_of_birth).format("YYYY"),"YYYY").fromNow() < MIN_DENTIST_AGE){
            errors.push('The dentist is too young');
        }
        if (errors.length > 0)return reject(errors);
        fulfill(form);
    });
};

exports.validate_client_form = function(form) {
    return new Promise(function (fulfill, reject) {
        var nameOptions = {min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH},
            errors = [];
        if (!validator.isAlpha(form.name.replace(' ', ''))) {
            errors.push('Please enter a valid name');
        }
        if (!validator.isLength(form.name, nameOptions)) {
            errors.push('The name must be between 3 and 50 characters.')
        }
        if (validator.isEmpty(form.email) || !validator.isEmail(form.email)) {
            errors.push('Enter a valid email address.');
        }
        if(moment(moment(form.date_of_birth).format("YYYY"),"YYYY").fromNow() < MIN_CLIENT_AGE){
            errors.push('The client is too young');
        }
        if (errors.length > 0)return reject(errors);
        fulfill(form);
        console.log(form.date_of_birth.toISOString() - new Date().toISOString());
    });
};

exports.validate_phone_number = function(phone_number){

    return new Promise(function(fulfill,reject){
        if(validator.isInt(phone_number)) {
            fulfill(phone_number);
        }else {
            reject('Please enter a valid UK phone number.')
        }
    });
};

exports.validate_email = function(email){

    return new Promise(function(fulfill,reject){
        if(validator.isEmail(email)) {
            fulfill(email);
        }else {
            reject('Please enter a valid email address.')
        }
    });
};

exports.validate_password = function(form){
   return new Promise(function(fulfill,reject){
       if(validator.matches(form.new_password,form.new_password_confirm)) {
           if(form.new_password.length >= MIN_PASSWORD_LENGTH){
               crypt(form.new_password).hash(function (err, hashed_password) {
                   if (err) reject(err);
                   fulfill(hashed_password);
               });
           }else{
               reject('The password must be at least ' + MIN_PASSWORD_LENGTH + ' long');
           }
       }else{
           reject('The password does not match the confirmation password');
       }
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
                    if(form.password.length >= MIN_PASSWORD_LENGTH){
                        crypt(form.password).hash(function (err, hashed_password) {
                            if (err) reject(err);
                            form.hash = hashed_password;
                            callback();
                        });
                    }else{
                        errors.push('Please make sure the password length is at least ' + MIN_PASSWORD_LENGTH + ' long');
                        callback();
                    }
                }else{
                    errors.push('The password does not match the confirmation password');
                    callback();
                }
            },
            function(callback){

                var counter = 0;
                if(!validator.isAlpha(form.name.replace(' ',''))){errors.push('Please enter a valid name')}
                if(!validator.isLength(form.name,nameOptions)){errors.push('The name must be between 3 and 50 characters.')}
                if(validator.isEmpty(form.email) || !validator.isEmail(form.email)){errors.push('Enter a valid email address.')}if(validator.isEmpty(form.username) || !validator.isLength(form.username,usernameOptions)){errors.push('The username must be between 5 and 20 characters.')}
                if(!validator.isAlphanumeric(form.username)){errors.push('The username can only contain alphanumerical characters only')}
                dataController.check_username_availability(form.username).then(function(available){
                    if(!available){errors.push('Username Taken'); counter++}
                });
                dataController.check_staff_email_availability(form.email).then(function(available){
                    if(!available){errors.push('Email is Taken'); counter++}
                });
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