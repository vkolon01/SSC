/**
 * Created by Kolodko on 05-Apr-17.
 */
var nodemailer = require('nodemailer'),
    moment = require('moment');
const COMPANY_NAME = "Sunshine Smile Cogway";

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user:'GiveMeYourEmailPlease@gmail.com',
        pass:'supersecretpassword2017'
    }
});

exports.sendGreetingEmail = function(account_data){
    if(account_data.role == 'customer'){
        var email = {
            from:'GiveMeYourEmailPlease@gmail.com',
            to: account_data.account_info.email,
            subject: 'Welcome to ' + COMPANY_NAME,
            text: 'Hello ' + account_data.account_info.name + ' and welcome to ' + COMPANY_NAME + '.\n\n'+
            'You registered with us on ' + moment(account_data.account_info.registration_date).format('DD-MM-YYYY') + ' and from now on you will be receiving all your notifications on this email.'
        };
    }
    if(account_data.role == 'dentist'){
        var email = {
            from:'GiveMeYourEmailPlease@gmail.com',
            to: account_data.account_info.email,
            subject: 'Welcome to ' + COMPANY_NAME,
            text: 'Hello ' + account_data.account_info.name + ' and welcome to ' + COMPANY_NAME + '.\n\n'+
            'As an employee at ' + COMPANY_NAME + ' you will receive all your notifications, including incoming appointments, on this email address.'
        };
    }
    transporter.sendMail(email,function(err){if(err) console.log(err)})
};
exports.sendChangeEmailNotification = function(data,new_email){
    if(data.role == 'customer'){
        var email = {
            from:'GiveMeYourEmailPlease@gmail.com',
            to: new_email,
            subject: 'Change of email at ' + COMPANY_NAME,
            text: 'Hello ' + data.account_info.name + '. You recently changed your email address at ' + COMPANY_NAME + '.\n\n'+
            'From now on you will be receiving all your notifications on ' + new_email + '.'
        };
    }
    if(data.role == 'dentist'){
        var email = {
            from:'GiveMeYourEmailPlease@gmail.com',
            to: new_email,
            subject: 'Change of email at ' + COMPANY_NAME,
            text: 'Hello ' + data.account_info.name + '. Your email address at ' + COMPANY_NAME + ' is now changed. From now on you will receive all appointment notifications on ' + new_email + '.'
        };
    }

    transporter.sendMail(email,function(err){if(err) console.log(err)})
};
exports.sendChangePhoneNumberNotification = function(data,new_phone_number){
    var email = {
        from:'GiveMeYourEmailPlease@gmail.com',
        to: data.account_info.email,
        subject: 'Welcome to ' + COMPANY_NAME,
        text: 'Hello ' + data.account_info.name + '. You recently changed your phone number at ' + COMPANY_NAME + '.\n\n'+
        'The phone number is now ' + new_phone_number + '.'
    };
    transporter.sendMail(email,function(err){if(err) console.log(err)})
};
exports.sendRemovedAccountNotification = function(removed_account){
    if(removed_account.role == 'customer'){
        var email = {
            from:'GiveMeYourEmailPlease@gmail.com',
            to: removed_account.account_info.email,
            subject: 'Goodbye from ' + COMPANY_NAME,
            text: 'Hello ' + removed_account.account_info.name + '. You recently decided to leave ' + COMPANY_NAME + '.\n\n'+
            'Your account has been removed and you will not receive any more emails from us. ' +
            'To use our services in the future you will need to get registered at our reception again. \n\n ' +
            'Thank you.'
        };
    }
    if(removed_account.role == 'dentist'){
        var email = {
            from:'GiveMeYourEmailPlease@gmail.com',
            to: removed_account.account_info.email,
            subject: COMPANY_NAME + '. Termination of employment ',
            text: 'Hello ' + removed_account.account_info.name + '. Your account is now terminated as you are not employed at ' + COMPANY_NAME + ' anymore \n' +
            'Thank you.'
        };
    }
    transporter.sendMail(email,function(err){if(err) console.log(err)});
};
