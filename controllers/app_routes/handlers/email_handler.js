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

exports.sendGreetingEmail = function(customer_data){
    var email = {
        from:'GiveMeYourEmailPlease@gmail.com',
        to: customer_data.account_info.email,
        subject: 'Welcome to ' + COMPANY_NAME,
        text: 'Hello ' + customer_data.account_info.name + ' and welcome to ' + COMPANY_NAME + '.\n\n'+
            'You registered with us on ' + moment(customer_data.account_info.registration_date).format('DD-MM-YYYY') + ' and from now on will be receiving appointment notifications on this email.'
    };
    transporter.sendMail(email,function(err){if(err) console.log(err)})
};
exports.sendChangeEmailNotification = function(customer_data,new_email){
    var email = {
        from:'GiveMeYourEmailPlease@gmail.com',
        to: new_email,
        subject: 'Welcome to ' + COMPANY_NAME,
        text: 'Hello ' + customer_data.account_info.name + '. You recently changed your email address at ' + COMPANY_NAME + '.\n\n'+
        'From now on will be receiving appointment notifications on ' + new_email + '.'
    };
    transporter.sendMail(email,function(err){if(err) console.log(err)})
};
exports.sendChangePhoneNumberNotification = function(customer_data,new_phone_number){
    var email = {
        from:'GiveMeYourEmailPlease@gmail.com',
        to: customer_data.account_info.email,
        subject: 'Welcome to ' + COMPANY_NAME,
        text: 'Hello ' + customer_data.account_info.name + '. You recently changed your phone number at ' + COMPANY_NAME + '.\n\n'+
        'The phone number is now ' + new_phone_number + '.'
    };
    transporter.sendMail(email,function(err){if(err) console.log(err)})
};
exports.sendRemovedAccountNotification = function(removed_account){
    var email = {
        from:'GiveMeYourEmailPlease@gmail.com',
        to: removed_account.account_info.email,
        subject: 'Welcome to ' + COMPANY_NAME,
        text: 'Hello ' + removed_account.account_info.name + '. You recently decided to leave ' + COMPANY_NAME + '.\n\n'+
        'Your account has been removed and you will not receive any more emails from us. ' +
        'To use our services in the future you will need to get registered at our reception again. \n\n ' +
        'Thank you.'
    };
    transporter.sendMail(email,function(err){if(err) console.log(err)});
};
