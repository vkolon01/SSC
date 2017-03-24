var express = require('express'),
    bodyParser = require('body-parser'),
    validator = require('express-validator'),
    Promise = require('promise'),
    crypt = require('password-hash-and-salt'),
    async = require('async');

exports.validate_form = function(form){
    var errors = [];
    return new Promise(function (fulfill,reject){
        if(form.password === form.password_confirm) {
            crypt(form.password).hash(function (err, hashed_password) {
                if (err) reject(err);
                form.hash = hashed_password;
                fulfill(form);
            });
        }else{
            errors.push('The confirmation password does not match');
        }

        if(errors)reject(errors);
        fulfill(form);
    });

};