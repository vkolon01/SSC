/**
 * Created by Kolodko on 05-Apr-17.
 */
var nodemailer = require('nodemailer'),
    moment = require('moment');
const COMPANY_NAME = "Sunshine Smile Cogway"

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

