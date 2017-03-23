var express = require('express'),
    bodyParser = require('body-parser'),
    validator = require('express-validator'),
    crypt = require('password-hash-and-salt'),
    async = require('async');

exports.validate_form = function(form){
    async.series([
        function(callback){
            if(form.password === form.password_confirm) {
                crypt(form.password).hash(function (err, hashed_password) {
                    if (err) throw(err);
                    form.hash = hashed_password;
                    callback(null, form);
                });
            }
        }
    ],function(err,validated_form){
        console.log('im executed');
        return validated_form;
    });
};